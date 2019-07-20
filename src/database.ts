import faunadb, { query } from "faunadb";

const client = new faunadb.Client({
  secret: "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9"
});

type QueryFn = (q: typeof query) => faunadb.Expr;

export const runQuery = (queryFn: QueryFn) => {
  return client.query(queryFn(query));
};
