import faunadb, { query as q } from 'faunadb'

type UserDocument = {
  ref: faunadb.values.Ref
  ts: number
  data: {
    email: string
    preferences?: {
      encrypted?: boolean
    }
  }
}

type ProfileApiConfig = {
  client: faunadb.Client
}

let config: ProfileApiConfig

export const configure = (newConfig: ProfileApiConfig) => {
  config = newConfig
}

export const getProfile = async () => {
  const userDocument: UserDocument = (await config.client.query(
    q.Get(q.Identity())
  )) as any

  return userDocument
}
