"use client";
import React from "react";
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { useAppSelector } from "../../lib/redux/store";

const httpLink = createHttpLink({
  uri: "https://btabc.dhpgo.com/graphql",
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
    uri: "https://btabc.dhpgo.com/graphql",
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    ssrMode: true,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};