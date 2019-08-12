import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit'
import { Dispatch } from 'react'
import * as noteApi from 'apis/noteApi'

export type NoteItem = {
  id: string
  ts: number
  content: string
}

type NoteState = {
  error?: Error
  updatingNoteId?: string
  deletingNoteId?: string
  items: NoteItem[]
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

const initialState: NoteState = {
  error: undefined,
  updatingNoteId: undefined,
  deletingNoteId: undefined,
  items: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false
}

const noteSlice = createSlice({
  initialState,
  slice: 'notes',
  reducers: {
    fetchNotesStart: state => {
      state.isLoading = true
    },
    fetchNotesSuccess: (state, action) => {
      state.isLoading = false
      state.items = action.payload.notes
    },
    fetchNotesError: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
    },
    createNoteStart: state => {
      state.isCreating = true
    },
    createNoteSuccess: (state, action) => {
      state.isCreating = false
      state.items.unshift(action.payload.note)
    },
    createNoteError: (state, action) => {
      state.isCreating = false
      state.error = action.payload.error
    },
    updateNoteStart: (state, action) => {
      state.isUpdating = true
      state.updatingNoteId = action.payload.noteId
    },
    updateNoteSuccess: (state, action) => {
      state.isUpdating = false
      state.updatingNoteId = undefined
      state.items = state.items.map(item => {
        if (item.id === action.payload.note.id) {
          return action.payload.note
        }

        return item
      })
    },
    updateNoteError: (state, action) => {
      state.isUpdating = false
      state.updatingNoteId = undefined
      state.error = action.payload.error
    },
    deleteNoteStart: (state, action) => {
      state.isDeleting = true
      state.deletingNoteId = action.payload.noteId
    },
    deleteNoteSuccess: (state, action) => {
      state.isDeleting = false
      state.deletingNoteId = undefined
      state.items = state.items.filter(
        item => item.id !== action.payload.note.id
      )
    },
    deleteNoteError: (state, action) => {
      state.isDeleting = false
      state.deletingNoteId = undefined
      state.error = action.payload.error
    }
  }
})

const { actions, reducer } = noteSlice

/* Actions */

export const fetchNotes = () => async (
  dispatch: Dispatch<PayloadAction>
): Promise<NoteItem[] | undefined> => {
  dispatch(actions.fetchNotesStart())

  try {
    const noteDocuments = await noteApi.getAllNotes()
    const notes = noteDocuments.map(noteDocumentToItem)
    dispatch(
      actions.fetchNotesSuccess({
        notes
      })
    )
    return notes
  } catch (error) {
    dispatch(actions.fetchNotesError({ error }))
  }
}

export const createNote = () => async (
  dispatch: Dispatch<PayloadAction>
): Promise<NoteItem | undefined> => {
  dispatch(actions.createNoteStart())

  try {
    const noteDocument = await noteApi.createNote({
      content: ''
    })
    const note = noteDocumentToItem(noteDocument)
    dispatch(actions.createNoteSuccess({ note }))
    return note
  } catch (error) {
    dispatch(actions.createNoteError({ error }))
  }
}

export const updateNoteById = (
  noteId: string,
  data: noteApi.NoteDocumentData
) => async (
  dispatch: Dispatch<PayloadAction>
): Promise<NoteItem | undefined> => {
  dispatch(actions.updateNoteStart({ noteId }))

  try {
    const updatedNoteDocument = await noteApi.updateNoteById(noteId, data)
    const updatedNote = noteDocumentToItem(updatedNoteDocument)
    dispatch(actions.updateNoteSuccess({ note: updatedNote }))
    return updatedNote
  } catch (error) {
    dispatch(actions.updateNoteError({ error }))
  }
}

export const deleteNoteById = (noteId: string) => async (
  dispatch: Dispatch<PayloadAction>
): Promise<NoteItem | undefined> => {
  dispatch(actions.deleteNoteStart({ noteId }))

  try {
    const deletedNoteDocument = await noteApi.deleteNoteById(noteId)
    const deletedNote = noteDocumentToItem(deletedNoteDocument)
    dispatch(actions.deleteNoteSuccess({ note: deletedNote }))
    return deletedNote
  } catch (error) {
    dispatch(actions.deleteNoteError({ error }))
  }
}

/* Selectors */

export const selectNotes = createSelector(['notes.items'])

export const selectLoadingState = createSelector(
  ['notes'],
  state => ({
    isLoading: state.isLoading,
    isCreating: state.isCreating,
    isDeleting: state.isDeleting
  })
)

/* Utils */

const noteDocumentToItem = (document: noteApi.NoteDocument): NoteItem => {
  return {
    id: document.ref.id,
    ts: document.ts,
    content: document.data.content
  }
}

export default reducer
