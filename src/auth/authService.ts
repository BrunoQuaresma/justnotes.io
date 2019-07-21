import faunadb, { query as q } from 'faunadb'
import cookies from 'js-cookie'

const client = new faunadb.Client({
  secret: String(process.env.REACT_APP_FAUNA_AUTH_KEY)
})

type Credentials = {
  email: string
  password: string
}

export const signUp = async ({ email, password }: Credentials) => {
  const session: any = await client.query(
    q.Let(
      {
        user: q.Create(q.Collection('Users'), {
          data: { email },
          credentials: { password }
        }),
        token: q.Login(q.Select(['ref'], q.Var('user')), { password })
      },
      {
        id: q.Select(['instance', 'id'], q.Var('token')),
        secret: q.Select(['secret'], q.Var('token'))
      }
    )
  )

  setSession(session)

  return session
}

export const signIn = async ({ email, password }: Credentials) => {
  const session: any = await client.query(
    q.Let(
      {
        token: q.Login(q.Match(q.Index('user_by_email'), [email]), { password })
      },
      {
        id: q.Select(['instance', 'id'], q.Var('token')),
        secret: q.Select(['secret'], q.Var('token'))
      }
    )
  )

  setSession(session)

  return session
}

type AuthSession = {
  id: string
  secret: string
}

export const setSession = (session: AuthSession) => {
  cookies.set('session', session)
}

export const getSession = (): AuthSession | undefined => {
  return cookies.getJSON('session')
}

export const logout = () => {
  cookies.remove('session')
}
