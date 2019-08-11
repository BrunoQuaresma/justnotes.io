import faunadb, { query as q } from 'faunadb'

type Credentials = {
  email: string
  password: string
}

export type AuthSession = {
  id: string
  secret: string
}

type AuthStorage = {
  set: (key: string, value: any) => void
  remove: (key: string) => void
  getJSON: <T>(key: string) => T
}

type AuthConfig = {
  client: faunadb.Client
  storage: AuthStorage
  event: {
    emit: (eventName: string, value: any) => void
  }
}

export const events = {
  startSession: 'start_session'
}

let config: AuthConfig

export const configure = (newConfig: AuthConfig) => {
  config = newConfig

  const existentSession = getSession()

  if (existentSession) {
    config.event.emit(events.startSession, existentSession)
  }
}

export const signUp = async ({ email, password }: Credentials) => {
  const session: any = await config.client.query(
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
  const session: any = await config.client.query(
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

export const setSession = (session: AuthSession) => {
  config.storage.set('session', session)
  config.event.emit(events.startSession, session)
}

export const getSession = (): AuthSession | undefined => {
  return config.storage.getJSON('session')
}

export const logout = () => {
  config.storage.remove('session')
}