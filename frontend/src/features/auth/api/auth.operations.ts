import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignUpInput!) {
    signup(input: $input) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;
