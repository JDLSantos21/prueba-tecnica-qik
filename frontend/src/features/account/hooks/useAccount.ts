import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import {
  CREATE_ACCOUNT_MUTATION,
  GET_ACCOUNTS_QUERY,
  GET_ACCOUNT_QUERY,
  LOOKUP_ACCOUNT_QUERY,
} from "../account.operations";
import {
  Account,
  GetAccountsResult,
  GetAccountResult,
} from "../types/account.types";

export function useAccounts() {
  const { data, loading, error, refetch } =
    useQuery<GetAccountsResult>(GET_ACCOUNTS_QUERY);

  return {
    accounts: data?.accounts || [],
    loading,
    error,
    refetch,
  };
}

export function useAccount(id: string) {
  const { data, loading, error, refetch } = useQuery<GetAccountResult>(
    GET_ACCOUNT_QUERY,
    {
      variables: { id },
      skip: !id,
    },
  );

  return {
    account: data?.account,
    loading,
    error,
    refetch,
  };
}

export function useCreateAccount() {
  const [createAccountMutation, { loading, error }] = useMutation<{
    createAccount: Account;
  }>(CREATE_ACCOUNT_MUTATION, {
    refetchQueries: [{ query: GET_ACCOUNTS_QUERY }],
    awaitRefetchQueries: true,
  });

  const createAccount = async () => {
    try {
      const result = await createAccountMutation();
      return result.data?.createAccount;
    } catch (err) {
      throw err;
    }
  };

  return { createAccount, loading, error };
}

export interface AccountLookupResult {
  id: string;
  accountNumber: string;
  ownerName: string;
}

export function useLookupAccount() {
  const [lookupQuery, { data, loading, error }] = useLazyQuery<{
    lookupAccount: AccountLookupResult | null;
  }>(LOOKUP_ACCOUNT_QUERY, {
    fetchPolicy: "network-only",
  });

  const lookup = async (accountNumber: string) => {
    const result = await lookupQuery({
      variables: { accountNumber },
    });
    return result.data?.lookupAccount || null;
  };

  return {
    lookup,
    result: data?.lookupAccount || null,
    loading,
    error,
  };
}
