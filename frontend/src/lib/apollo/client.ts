import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { tokenService } from "@/features/auth/services/token.service";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/graphql";

const httpLink = new HttpLink({
  uri: API_URL,
});

const authLink = new SetContextLink(async (prevContext) => {
  const token = await tokenService.getToken();
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(callback: () => void) {
  onUnauthorizedCallback = callback;
}

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.toLowerCase().includes("unauthorized")
      ) {
        onUnauthorizedCallback?.();
        return;
      }
    }
  } else {
    if ("statusCode" in error && error.statusCode === 401) {
      onUnauthorizedCallback?.();
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          keyArgs: [
            "input",
            ["accountId", "type", "startDate", "endDate", "limit"],
          ],
          merge(existing, incoming, { args, readField }) {
            if (args?.input?.offset === 0 || !existing) {
              return incoming;
            }

            const existingData = existing?.data || [];
            const incomingData = incoming.data || [];

            const existingIds = new Set(
              existingData.map((item: any) => readField("id", item)),
            );

            const newItems = incomingData.filter(
              (item: any) => !existingIds.has(readField("id", item)),
            );

            return {
              ...incoming,
              data: [...existingData, ...newItems],
            };
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache,
});
