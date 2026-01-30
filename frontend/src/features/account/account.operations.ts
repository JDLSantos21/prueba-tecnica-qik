import { gql } from "@apollo/client";

export const GET_ACCOUNTS_QUERY = gql`
  query GetAccounts {
    accounts {
      id
      accountNumber
      ownerId
      balance
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACCOUNT_QUERY = gql`
  query GetAccount($id: String!) {
    account(id: $id) {
      id
      accountNumber
      ownerId
      balance
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount {
    createAccount {
      id
      accountNumber
      ownerId
      balance
      createdAt
      updatedAt
    }
  }
`;

export const LOOKUP_ACCOUNT_QUERY = gql`
  query LookupAccount($accountNumber: String!) {
    lookupAccount(accountNumber: $accountNumber) {
      id
      accountNumber
      ownerName
    }
  }
`;
