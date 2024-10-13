import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Mutation($params: RegisterAuthenticateInput!) {
    register(params: $params) {
      node {
        user {
          created_date
          email
          id
          modify_date
          username
        }
      }
      message
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation Login($loginAuthenticateInput: LoginInput!) {
    login(loginAuthenticateInput: $loginAuthenticateInput) {
      message
      node {
        user {
          created_date
          email
          id
          modify_date
          username
        }
        refreshToken
        accessToken
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation Refresh_token($params: RefreshTokenInput!) {
  refresh_token(params: $params) {
    message
    node {
      refreshToken
      accessToken
      user {
        username
        id
        email
        modify_date
        created_date
      }
    }
  }
}
`;
