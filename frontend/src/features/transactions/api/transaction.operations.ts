import { gql } from "@apollo/client";

export const GET_TRANSACTIONS_QUERY = gql`
  query GetTransactions($input: GetTransactionsInput!) {
    transactions(input: $input) {
      data {
        id
        amount
        type
        accountId
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
`;

export const GET_STATEMENT_QUERY = gql`
  query GetStatement($accountId: String!, $month: Int, $year: Int) {
    statement(accountId: $accountId, month: $month, year: $year) {
      currentBalance
      totalCredits
      totalDebits
      transactions {
        id
        amount
        type
        description
        createdAt
      }
    }
  }
`;

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      type
      accountId
      description
      createdAt
    }
  }
`;

export const TRANSFER_MUTATION = gql`
  mutation Transfer($input: TransferInput!) {
    transfer(input: $input) {
      success
      message
      debitTransaction {
        id
        amount
        type
        description
        createdAt
      }
      creditTransaction {
        id
        amount
        type
        description
        createdAt
      }
    }
  }
`;
