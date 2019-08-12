import faunadb, { query as q } from 'faunadb'

type Page<T> = {
  data: T[]
}

export type NoteData = {
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

export const getAllNotes = async () => {
  const result: Page<Note> = (await config.client.query(
    q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
      q.Get(ref)
    )
  )) as any

  return result.data
}

export const updateNoteById = async (noteId: string, data: NoteData) => {
  const updatedNote: Note = (await config.client.query(
    q.Update(q.Ref(q.Collection('Notes'), noteId), { data })
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

export const deleteNoteById = async (noteId: string) => {
  const deletedNote: Note = (await config.client.query(
    q.Delete(q.Ref(q.Collection('Notes'), noteId))
  )) as any

  return deletedNote
}
