# Qik Banco Digital - Prueba Técnica

> Implementación Full-Stack de un Ledger Bancario utilizando **NestJS** y **React Native**.

Este repositorio contiene la solución a la prueba técnica para Qik Banco Digital. El sistema implementa una arquitectura limpia y modular para gestionar cuentas, transacciones y balances, enfacado en la **integridad de datos**, **atomicidad** y **testing automatizado**.

---

## Arquitectura y Stack

### Backend (`/backend`)

- **Framework**: [NestJS](https://nestjs.com/) (Modular Architecture)
- **Database**: PostgreSQL (con [TypeORM](https://typeorm.io/))
- **API**: GraphQL (Code First)
- **Caching**: Redis (para optimización de consultas)
- **Integridad**: Bloqueo pesimista (`Pessimistic Locking`) para prevenir condiciones de carrera en transacciones.

### Frontend (`/frontend`)

- **Framework**: React Native ([Expo](https://expo.dev/))
- **Language**: TypeScript
- **Architecture**: Atomic Design + Feature-based folder structure.
- **State Management**: Zustand & Apollo Client.
- **Testing**: Jest + React Native Testing Library.

---

## Guía de Inicio

### Prerrequisitos

- Docker & Docker Compose
- Node.js (v18+) & NPM

### 1. Iniciar Infraestructura (Backend)

Levanta la base de datos (PostgreSQL) y Redis automáticamente:

1.  Ve a la carpeta `backend/`, copia el archivo `.env.example` y renómbralo a `.env`.
2.  Levanta los servicios y el servidor:

    ```bash
    cd backend

    # Levantar base de datos y Redis
    docker-compose up -d

    # Iniciar el servidor (Development)
    npm install
    npm run start:dev
    ```

> El servicio estará disponible en: `http://localhost:3000/graphql`

### 2. Iniciar Aplicación Móvil (Frontend)

```bash
cd frontend
npm install

# Iniciar con Expo
npx expo start
```

> Escanea el código QR con tu dispositivo o usa un emulador (Android/iOS).

### 3. Configuración para Dispositivos Físicos 📱

Si vas a probar la App en un celular real (no emulador), necesitas configurar la IP de tu máquina local, ya que `localhost` no funciona desde el teléfono.

1.  Averigua tu **IP Local** (ej: `192.168.1.15`).
2.  Ve a la carpeta `frontend/`, copia el archivo de ejemplo y renómbralo a `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Edita `.env` y coloca tu IP:
    ```bash
    EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000/graphql
    ```
4.  Reinicia Expo: `npx expo start -c`

---

## Testing Strategy

La calidad del código está garantizada por múltiples capas de pruebas.

### Backend (E2E & Concurrencia)

Validamos flujos completos y la robustez ante condiciones de carrera (ej: 5 transferencias simultáneas).

```bash
cd backend
# Ejecuta todos los tests E2E y de Atomicidad
npm run test:e2e
```

### Frontend (Unit & Integration)

`
Validamos componentes visuales y lógica de formularios.

```bash
cd frontend
# Ejecuta Unit y Integration Tests
npm run test
```

---

## Documentación API (GraphQL Playground)

Una vez iniciado el backend, visita:
**[http://localhost:3000/graphql](http://localhost:3000/graphql)**

El Playground incluye documentación interactiva de todos los `Queries` y `Mutations`.

### 📝 Ejemplos (Copy & Paste)

Aquí tienes algunas operaciones comunes para probar rápidamente en el Playground:

#### 1. Crear Usuario

```graphql
mutation Signup {
  signup(
    input: {
      username: "usuario_demo"
      password: "Password123!"
      name: "Juan"
      lastName: "Perez"
    }
  ) {
    accessToken
    user {
      id
      username
    }
  }
}
```

#### 2. Iniciar Sesión (Obtener Token)

> ⚠️ **Nota**: Copia el `accessToken` de la respuesta para el Header `Authorization: Bearer <TOKEN>`.

```graphql
mutation Login {
  login(input: { username: "usuario_demo", password: "Password123!" }) {
    accessToken
  }
}
```

#### 3. Crear Cuenta Bancaria

> Requiere Header Authorization.

```graphql
mutation CreateAccount {
  createAccount {
    id
    accountNumber
    balance
  }
}
```

#### 4. Crear Transacción (Crédito o Débito)

> El campo `type` puede ser `CREDIT` o `DEBIT`.

```graphql
mutation CreateTransaction {
  createTransaction(
    input: {
      accountId: "ID_DE_LA_CUENTA"
      amount: 50.00
      type: CREDIT
      description: "Pago recibido"
    }
  ) {
    id
    amount
    type
  }
}
```

#### 5. Transferencia entre Cuentas

> Requiere dos cuentas distintas.

```graphql
mutation TransferMoney {
  transfer(
    input: {
      fromAccountId: "ID_CUENTA_ORIGEN"
      toAccountId: "ID_CUENTA_DESTINO"
      amount: 50.00
      description: "Pago de Almuerzo"
    }
  ) {
    success
    message
  }
}
```

#### 6. Ver Mis Cuentas

> Lista todas las cuentas del usuario logueado.

```graphql
query MyAccounts {
  accounts {
    id
    accountNumber
    balance
  }
}
```

#### 7. Ver Transacciones Paginadas

> Obtiene el historial con filtros de fecha y paginación.

```graphql
query GetPaginatedTransactions {
  transactions(
    input: {
      accountId: "ID_DE_LA_CUENTA"
      limit: 10
      offset: 0
      # Opcional: startDate: "2026-01-29",
      # Opcional: endDate: "2026-01-31",
      # Opcional: type: CREDIT | DEBIT
    }
  ) {
    data {
      id
      amount
      type
      description
      createdAt
    }
    total
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

#### 8. Traer una Cuenta por ID

```graphql
query GetAccount {
  account(id: "ID_DE_LA_CUENTA") {
    id
    accountNumber
    balance
    ownerId
    createdAt
  }
}
```

---
