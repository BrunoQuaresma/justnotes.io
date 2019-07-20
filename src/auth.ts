import faunadb, { query as q } from "faunadb";
import cookies from "js-cookie";

type SignUpValues = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: SignUpValues) => {
  const client = new faunadb.Client({
    secret: "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9"
  });

  const credentials: any = await client.query(
    q.Let(
      {
        user: q.Create(q.Collection("Users"), {
          data: { email },
          credentials: { password }
        }),
        token: q.Login(q.Select(["ref"], q.Var("user")), { password })
      },
      {
        id: q.Select(["ref", "id"], q.Var("user")),
        secret: q.Select(["secret"], q.Var("token"))
      }
    )
  );

  setCredentials(credentials);

  return credentials;
};

type Credentials = {
  id: string;
  secret: string;
};

export const setCredentials = (credentials: Credentials) => {
  cookies.set("credentials", credentials);
};
