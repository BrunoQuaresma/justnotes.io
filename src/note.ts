import faunadb, { query as q } from 'faunadb'

export type Note = {
  ref: faunadb.values.Ref
  ts: number
  data: {
    content: string
  }
}

type NoteConfig = {
  client: faunadb.Client
}

let config: NoteConfig

export const configure = (newConfig: NoteConfig) => {
  config = newConfig
}

export const getUserNotes = () =>
  config.client.query(
    q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
      q.Get(ref)
    )
  )

export const updateNoteContent = (noteId: string, noteContent: string) =>
  config.client.query(
    q.Update(q.Ref(q.Collection('Notes'), noteId), {
      data: { content: noteContent }
    })
  )

export const createEmptyNote = () =>
  config.client.query(
    q.Create(q.Collection('Notes'), {
      data: { owner: q.Identity(), content: '' }
    })
  )

export const deleteNote = (noteId: string) =>
  config.client.query(q.Delete(q.Ref(q.Collection('Notes'), noteId)))
