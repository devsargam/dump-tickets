import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  gql,
  OperationVariables,
} from "@apollo/client";
import { LINEAR } from "./constants";

/**
 * Initialize Apollo Client instance for Linear GraphQL API.
 */
const apolloLinear: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: LINEAR.GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

function withAuthHeader(token: string) {
  return {
    headers: {
      authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
    },
  };
}

/**
 * Execute a GraphQL query against the Linear API.
 * @param query - GraphQL query string starting with the `query` keyword.
 * @param token - Linear access token.
 * @param variables - Query variables.
 */
export async function linearQuery<
  Result = any,
  Vars extends OperationVariables = OperationVariables
>(query: string, token: string, variables?: Vars): Promise<Result> {
  const QUERY = gql`
    ${query}
  `;

  const { data, errors } = await apolloLinear.query<Result, Vars>({
    query: QUERY,
    variables,
    context: withAuthHeader(token),
    fetchPolicy: "no-cache",
  });

  if (errors && errors.length) throw new Error(errors[0].message);
  return data;
}

/**
 * Execute a GraphQL mutation against the Linear API.
 * @param mutation - GraphQL mutation string starting with the `mutation` keyword.
 * @param token - Linear access token.
 * @param variables - Mutation variables.
 */
export async function linearMutation<
  Result = any,
  Vars extends OperationVariables = OperationVariables
>(mutation: string, token: string, variables?: Vars): Promise<Result> {
  const MUTATION = gql`
    ${mutation}
  `;

  const { data, errors } = await apolloLinear.mutate<Result, Vars>({
    mutation: MUTATION,
    variables,
    context: withAuthHeader(token),
  });

  if (errors && errors.length) throw new Error(errors[0].message);
  return data as Result;
}
