import faunadb, { query as q, Expr, Client } from 'faunadb'
import { getSession } from './authService'

export type Note = {
  ref: faunadb.values.Ref
  ts: number
  data: {
    content: string
  }
}

let client: Client

export const call = (expr: Expr) => {
  if (!client) {
    const session = getSession()
    if (!session) throw new Error('No session found.')

    client = new faunadb.Client({ secret: session.secret })
  }

  return client.query(expr)
}

export const getUserNotes = () =>
  call(
    q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
      q.Get(ref)
    )
  )

export const updateNoteContent = (noteId: string, noteContent: string) =>
  call(
    q.Update(q.Ref(q.Collection('Notes'), noteId), {
      data: { content: noteContent }
    })
  )

export const createEmptyNote = () =>
  call(
    q.Create(q.Collection('Notes'), {
      data: { owner: q.Identity(), content: '' }
    })
  )

export const deleteNote = (noteId: string) =>
  call(q.Delete(q.Ref(q.Collection('Notes'), noteId)))
