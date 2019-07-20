import faunadb, { query as q } from "faunadb";
import cookies from "js-cookie";

type Credentials = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: Credentials) => {
  const client = new faunadb.Client({
    secret: "fnADTjTHCzACBxluxCcuz9vOZqD345VUcd9-BTF9"
  });

  const session: any = await client.query(
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

  setSession(session);

  return session;
};

type AuthSession = {
  id: string;
  secret: string;
};

export const setSession = (session: AuthSession) => {
  cookies.set("session", session);
};

export const logout = () => {
  cookies.remove("session");
};
