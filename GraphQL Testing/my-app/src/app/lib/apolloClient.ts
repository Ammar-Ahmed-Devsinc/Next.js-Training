// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "https://countries.trevorblades.com/", // Public GraphQL API
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});