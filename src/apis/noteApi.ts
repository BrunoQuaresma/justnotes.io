import faunadb, { query as q } from 'faunadb'
import { encrypt } from 'crypt'

type Page<T> = {
  data: T[]
}

export type NoteDocumentData = {
  content: string
}

export type NoteDocument = {
  ref: faunadb.values.Ref
  ts: number
  data: NoteDocumentData
}

type NoteApiConfig = {
  client: faunadb.Client
}

let config: NoteApiConfig

export const configure = (newConfig: NoteApiConfig) => {
  config = newConfig
}

export const getAllNotes = async () => {
  const result: Page<NoteDocument> = (await config.client.query(
    q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
      q.Get(ref)
    )
  )) as any

  return result.data
}

export const updateNoteById = async (
  noteId: string,
  data: NoteDocumentData
) => {
  const updatedNote: NoteDocument = (await config.client.query(
    q.Update(q.Ref(q.Collection('Notes'), noteId), { data })
  )) as any

  return updatedNote
}

export const createNote = async (data: NoteDocumentData) => {
  const newNote: NoteDocument = (await config.client.query(
    q.Create(q.Collection('Notes'), {
      data: { owner: q.Identity(), ...data }
    })
  )) as any

  return newNote
}

export const deleteNoteById = async (noteId: string) => {
  const deletedNote: NoteDocument = (await config.client.query(
    q.Delete(q.Ref(q.Collection('Notes'), noteId))
  )) as any

  return deletedNote
}

export const encryptNotes = async (secret: string) => {
  const noteDocuments = await getAllNotes()
  const encryptedNoteDocuments = noteDocuments.map(noteDocument =>
    encryptNoteDocument(noteDocument, secret)
  )
  const updateNotesQuery = encryptedNoteDocuments.map(noteDocument =>
    q.Update(noteDocument.ref, { data: noteDocument.data })
  )

  await config.client.query(
    q.Do(
      updateNotesQuery,
      q.Update(q.Identity(), {
        data: {
          preferences: {
            encrypted: true
          }
        }
      })
    )
  )

  return encryptedNoteDocuments
}

const encryptNoteDocument = (noteDocument: NoteDocument, secret: string) => ({
  ...noteDocument,
  data: {
    ...noteDocument.data,
    content: encrypt(noteDocument.data.content, secret)
  }
})
