"use client";
import React from "react";
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});

const authLink = setContext((_, { headers = {} }: { headers?: Record<string, string> }) => {
  const token = localStorage.getItem("accessToken");  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
}
);

export const ApolloClientProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const client = new ApolloClient({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    ssrMode: true,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
