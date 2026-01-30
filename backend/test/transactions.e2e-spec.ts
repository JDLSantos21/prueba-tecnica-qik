import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { GraphQLResponse } from './types';

describe('Transactions & Atomicity (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  // Variables para guardar los datos de los usuarios y cuentas
  let userAToken: string;
  let userBToken: string;
  let accountAId: string;
  let accountBId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.synchronize(true); // Limpio la base de datos antes de cada test
  });

  afterAll(async () => {
    await app.close();
  });

  const uniqueId = Date.now();

  const signupMutation = (username: string) => `
    mutation {
      signup(input: {
        username: "${username}",
        password: "password123",
        name: "Test",
        lastName: "User"
      }) {
        accessToken
      }
    }
  `;

  const createAccountMutation = `
    mutation {
      createAccount {
        id
        balance
        accountNumber
      }
    }
  `;

  // Funcion para ejecutar GraphQL
  const executeGql = (token: string, query: string) => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query });
  };

  it('Setup: Crear Usuarios y Cuentas', async () => {
    // Crear Usuario A
    const resA = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signupMutation(`userA_${uniqueId}`) })
      .expect(200);

    const bodyA = resA.body as GraphQLResponse<{
      signup: { accessToken: string };
    }>;
    expect(bodyA.errors).toBeUndefined();
    userAToken = bodyA.data?.signup.accessToken || '';
    expect(userAToken).toBeDefined();

    // Crear Usuario B
    const resB = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signupMutation(`userB_${uniqueId}`) })
      .expect(200);

    const bodyB = resB.body as GraphQLResponse<{
      signup: { accessToken: string };
    }>;
    expect(bodyB.errors).toBeUndefined();
    userBToken = bodyB.data?.signup.accessToken || '';
    expect(userBToken).toBeDefined();

    // Crear Cuenta A
    const accA = await executeGql(userAToken, createAccountMutation).expect(
      200,
    );
    const bodyAccA = accA.body as GraphQLResponse<{
      createAccount: { id: string };
    }>;
    expect(bodyAccA.errors).toBeUndefined();
    accountAId = bodyAccA.data?.createAccount.id || '';
    expect(accountAId).toBeDefined();

    // Crear Cuenta B
    const accB = await executeGql(userBToken, createAccountMutation).expect(
      200,
    );
    const bodyAccB = accB.body as GraphQLResponse<{
      createAccount: { id: string };
    }>;
    expect(bodyAccB.errors).toBeUndefined();
    accountBId = bodyAccB.data?.createAccount.id || '';
    expect(accountBId).toBeDefined();
  });

  it('Flujo Básico: Crédito y Débito', async () => {
    // Hacemos un deposito de 100 a la cuenta A
    const creditMutation = `
      mutation {
        createTransaction(input: {
          accountId: "${accountAId}",
          amount: 100,
          type: CREDIT,
          description: "Initial Deposit"
        }) {
          id
          amount
        }
      }
    `;
    const res = await executeGql(userAToken, creditMutation).expect(200);
    const body = res.body as GraphQLResponse;
    expect(body.errors).toBeUndefined();

    // Verifico el balance de la cuenta A
    const queryAccountA = `
      query {
        account(id: "${accountAId}") {
          balance
        }
      }
    `;
    const resA = await executeGql(userAToken, queryAccountA).expect(200);
    const bodyA = resA.body as GraphQLResponse<{
      account: { balance: number };
    }>;
    expect(bodyA.data?.account.balance).toBe(100);
  });

  it('Flujo de Transferencia: de Cuenta A -> Cuenta B', async () => {
    // Hacemos una transferencia de 20 de la cuenta A a la cuenta B
    const transferMutation = `
      mutation {
        transfer(input: {
          fromAccountId: "${accountAId}",
          toAccountId: "${accountBId}",
          amount: 20,
          description: "Test Transfer"
        }) {
          success
          message
        }
      }
    `;
    const res = await executeGql(userAToken, transferMutation).expect(200);
    const body = res.body as GraphQLResponse;
    expect(body.errors).toBeUndefined();

    // Verifico los balances de las cuentas A y B
    const queryAccountA = `
      query { account(id: "${accountAId}") { balance } }
    `;
    const resA = await executeGql(userAToken, queryAccountA);
    const bodyA = resA.body as GraphQLResponse<{
      account: { balance: number };
    }>;
    expect(bodyA.data?.account.balance).toBe(80); // 100 - 20 = 80

    const queryAccountB = `
      query { account(id: "${accountBId}") { balance } }
    `;
    const resB = await executeGql(userBToken, queryAccountB); // El usuario B consulta su cuenta
    const bodyB = resB.body as GraphQLResponse<{
      account: { balance: number };
    }>;
    expect(bodyB.data?.account.balance).toBe(20); // 0 + 20 = 20
  });

  it('Race Condition: Concurrencia y Atomicidad', async () => {
    // Estado actual: La cuenta A tiene 80.
    // Hacemos un débito de 30 a la cuenta A
    const debitMutation = `
      mutation {
         createTransaction(input: { accountId: "${accountAId}", amount: 30, type: DEBIT }) { id }
      }
    `;
    await executeGql(userAToken, debitMutation);

    // Verifico que la cuenta A tiene 50
    const checkRes = await executeGql(
      userAToken,
      `query { account(id: "${accountAId}") { balance } }`,
    );
    const bodyCheck = checkRes.body as GraphQLResponse<{
      account: { balance: number };
    }>;
    expect(bodyCheck.data?.account.balance).toBe(50);

    // Ahora ejecuto 5 transferencias concurrentes de 20 a la cuenta B.
    // Con esto intento retirar o transferir 100 de la cuenta A a la cuenta B.
    // Lo que deberia resular en 2 peticiones exitosas y 3 fallidas.
    // Saldo final de la cuenta A: 10.
    // Saldo final de la cuenta B: 60.

    const transferMutation = `
      mutation {
        transfer(input: {
          fromAccountId: "${accountAId}",
          toAccountId: "${accountBId}",
          amount: 20,
          description: "Concurrent Transfer"
        }) {
          success
        }
      }
    `;

    const promises = Array(5)
      .fill(null)
      .map(() => executeGql(userAToken, transferMutation)); // Ejecuto las 5 transferencias concurrentes

    const results = await Promise.all(promises);

    // Cuento las transferencias exitosas
    const successCount = results.filter((r) => {
      const body = r.body as GraphQLResponse<{
        transfer: { success: boolean };
      }>;
      return body.data?.transfer?.success === true;
    }).length;

    // Verifico los balances finales de las cuentas A y B
    const finalA = await executeGql(
      userAToken,
      `query { account(id: "${accountAId}") { balance } }`,
    );

    const bodyFinalA = finalA.body as GraphQLResponse<{
      account: { balance: number };
    }>;

    expect(bodyFinalA.data?.account.balance).toBe(10); // 50 - 40 = 10

    const finalB = await executeGql(
      userBToken,
      `query { account(id: "${accountBId}") { balance } }`,
    );

    const bodyFinalB = finalB.body as GraphQLResponse<{
      account: { balance: number };
    }>;

    expect(bodyFinalB.data?.account.balance).toBe(60); // 20 + 40 = 60

    // Verifico que solo 2 peticiones fueron exitosas
    expect(successCount).toBe(2);
  });
});
