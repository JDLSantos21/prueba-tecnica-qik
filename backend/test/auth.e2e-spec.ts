import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { GraphQLResponse } from './types';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

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
  const testUsername = `testuser${uniqueId}`;

  const signupMutation = `
    mutation {
      signup(input: {
        username: "${testUsername}",
        password: "password123",
        name: "Test",
        lastName: "User"
      }) {
        accessToken
        user {
          id
          username
        }
      }
    }
  `;

  const loginMutation = `
    mutation {
      login(input: {
        username: "${testUsername}",
        password: "password123"
      }) {
        accessToken
        user {
          id
          username
        }
      }
    }
  `;

  it('Registro de Usuario', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signupMutation })
      .expect(200)
      .expect((res) => {
        const body = res.body as GraphQLResponse<{
          signup: {
            accessToken: string;
            user: { id: string; username: string };
          };
        }>;
        expect(body.errors).toBeUndefined();
        expect(body.data?.signup).toHaveProperty('accessToken');
        expect(body.data?.signup.user.username).toEqual(testUsername);
      });
  });

  it('Login de Usuario', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: loginMutation })
      .expect(200)
      .expect((res) => {
        const body = res.body as GraphQLResponse<{
          login: {
            accessToken: string;
            user: { id: string; username: string };
          };
        }>;
        expect(body.errors).toBeUndefined();
        expect(body.data?.login).toHaveProperty('accessToken');
        expect(body.data?.login.user.username).toEqual(testUsername);
      });
  });

  it('Acceso a ruta protegida sin token', () => {
    const protectedQuery = `
      query {
        accounts {
          id
          balance
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: protectedQuery })
      .expect(200)
      .expect((res) => {
        const body = res.body as GraphQLResponse;
        expect(body.errors).toBeDefined();
        // Aquí espero un error de autenticación
        expect(body.errors?.[0].message).toMatch(/Unauthorized|Forbidden/i);
      });
  });
});
