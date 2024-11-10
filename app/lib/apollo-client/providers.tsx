"use client";
import React from "react";
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { useAppSelector } from "../../lib/redux/store";

const httpLink = createHttpLink({
  uri: "http://51.79.251.117:8080/graphql",
  credentials: 'include', // Send cookies with requests
});

export const ApolloClientProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const token = useAppSelector((state) => state.auth.accessToken);

  const authLink = setContext((_, { headers = {} }: { headers?: Record<string, string> }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    uri: "http://51.79.251.117:8080/graphql",
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    ssrMode: true,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};