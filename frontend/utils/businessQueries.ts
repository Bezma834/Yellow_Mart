import { gql } from "graphql-request";

export const GET_BUSINESSES = gql`
  query GetBusinesses {
    business {
      id
      name
      description
    }
  }
`;