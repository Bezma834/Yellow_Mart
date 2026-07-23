import axios from "axios";

const HASURA_URL = process.env.HASURA_URL!;

export const hasuraRequest = async (query: string, variables = {}) => {
  const res = await axios.post(
    HASURA_URL,
    {
      query,
      variables,
    },
    {
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_SECRET || "",
      },
    }
  );

  return res.data;
};