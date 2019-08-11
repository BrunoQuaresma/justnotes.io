import faunadb, { query as q } from 'faunadb'

type Page<T> = {
  data: T[]
}

type NoteData = {
  content: string
}

export type Note = {
  ref: faunadb.values.Ref
  ts: number
  data: NoteData
}

type NoteConfig = {
  client: faunadb.Client
}

let config: NoteConfig

export const configure = (newConfig: NoteConfig) => {
  config = newConfig
}

export const getUserNotes = async () => {
  const result: Page<Note> = (await config.client.query(
    q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
      q.Get(ref)
    )
  )) as any

  return result.data
}

export const updateNote = async (note: Note, data: NoteData) => {
  const updatedNote: Note = (await config.client.query(
    q.Update(note.ref, { data })
  )) as any

  return updatedNote
}

export const createNote = async (data: NoteData) => {
  const newNote: Note = (await config.client.query(
    q.Create(q.Collection('Notes'), {
      data: { owner: q.Identity(), ...data }
    })
  )) as any

  return newNote
}

export const deleteNote = (note: Note) =>
  config.client.query(q.Delete(note.ref))
