import faunadb, { query } from "faunadb";
import { getSession } from "./auth";

type QueryFn = (q: typeof query) => faunadb.Expr;

export const runQuery = (queryFn: QueryFn) => {
  const session = getSession();
  const secret = session
    ? session.secret
    : "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9";

  const client = new faunadb.Client({ secret });

  return client.query(queryFn(query));
};
