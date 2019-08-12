import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit'
import { Dispatch } from 'react'
import * as noteApi from 'apis/noteApi'

type NoteState = {
  error?: Error
  updatingNoteId?: string
  deletingNoteId?: string
  items: noteApi.Note[]
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
        if (item.ref.id === action.payload.note.ref.id) {
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
        item => item.ref.id !== action.payload.note.ref.id
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

export const fetchNotes = () => async (dispatch: Dispatch<PayloadAction>) => {
  dispatch(actions.fetchNotesStart())

  try {
    const notes = await noteApi.getAllNotes()
    return dispatch(actions.fetchNotesSuccess({ notes }))
  } catch (error) {
    return dispatch(actions.fetchNotesError({ error }))
  }
}

export const createNote = () => async (dispatch: Dispatch<PayloadAction>) => {
  dispatch(actions.createNoteStart())

  try {
    const note = await noteApi.createNote({ content: '' })
    dispatch(actions.createNoteSuccess({ note }))
    return note
  } catch (error) {
    dispatch(actions.createNoteError({ error }))
  }
}

export const updateNoteById = (
  noteId: string,
  data: noteApi.NoteData
) => async (dispatch: Dispatch<PayloadAction>) => {
  dispatch(actions.updateNoteStart({ noteId }))

  try {
    const updatedNote = await noteApi.updateNoteById(noteId, data)
    return dispatch(actions.updateNoteSuccess({ note: updatedNote }))
  } catch (error) {
    return dispatch(actions.updateNoteError({ error }))
  }
}

export const deleteNoteById = (noteId: string) => async (
  dispatch: Dispatch<PayloadAction>
) => {
  dispatch(actions.deleteNoteStart({ noteId }))

  try {
    const deletedNote = await noteApi.deleteNoteById(noteId)
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

export default reducer
