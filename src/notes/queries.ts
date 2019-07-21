import { query } from 'faunadb'

export const GET_USER_NOTES = (q: typeof query) =>
  q.Map(q.Paginate(q.Match(q.Index('notes_by_owner'), [q.Identity()])), ref =>
    q.Get(ref)
  )

export const UPDATE_NOTE_CONTENT = (noteId: string, noteContent: string) => (
  q: typeof query
) =>
  q.Update(q.Ref(q.Collection('Notes'), noteId), {
    data: { content: noteContent }
  })

export const CREATE_NOTE = (q: typeof query) =>
  q.Create(q.Collection('Notes'), {
    data: { owner: q.Identity(), content: '' }
  })

export const DELETE_NOTE = (noteId: string) => (q: typeof query) =>
  q.Delete(q.Ref(q.Collection('Notes'), noteId))
