import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://inviting-moray-87.hasura.app/v1/graphql";

const client = new GraphQLClient(endpoint);

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
    }
  }
`;

export const useProducts = async () => {
  const data = await client.request(GET_PRODUCTS);
  return data.products;
};