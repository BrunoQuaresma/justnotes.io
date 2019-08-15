import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit'
import { Dispatch } from 'react'
import * as noteApi from 'apis/noteApi'
import { decrypt, encrypt } from 'crypt'
import { selectPreferences } from './profileStore'
import { selectCryptoSecret } from './boardStore'

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
  isEncrypting: boolean
}

const initialState: NoteState = {
  error: undefined,
  updatingNoteId: undefined,
  deletingNoteId: undefined,
  items: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isEncrypting: false
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
    },

    encryptNotesStart: (state, action) => {
      state.isEncrypting = true
    },
    encryptNotesSuccess: (state, action) => {
      state.isEncrypting = false
      state.items = action.payload
    },
    encryptNotesError: (state, action) => {
      state.isEncrypting = false
      state.error = action.payload.error
    },

    replaceNotes: (state, action) => {
      state.items = action.payload
    }
  }
})

const { actions, reducer } = noteSlice

/* Actions */

export const fetchNotes = () => async (
  dispatch: Dispatch<PayloadAction>,
  getState: () => any
): Promise<NoteItem[] | undefined> => {
  const state = getState()

  dispatch(actions.fetchNotesStart())

  try {
    const noteDocuments = await noteApi.getAllNotes()
    const preferences = selectPreferences(state)
    const cryptoSecret = selectCryptoSecret(state)
    let notes = noteDocuments.map(noteDocumentToItem)

    if (preferences && preferences.encrypted) {
      notes = notes.map(desencryptNoteItem(cryptoSecret))
    }

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
  dispatch: Dispatch<PayloadAction>,
  getState: () => any
): Promise<NoteItem | undefined> => {
  const state = getState()

  dispatch(actions.updateNoteStart({ noteId }))

  try {
    const preferences = selectPreferences(state)
    const cryptoSecret = selectCryptoSecret(state)
    const updatedNoteDocument = await noteApi.updateNoteById(
      noteId,
      preferences && preferences.encrypted
        ? encryptNoteData(cryptoSecret)(data)
        : data
    )
    let updatedNoteItem = noteDocumentToItem(updatedNoteDocument)
    if (preferences && preferences.encrypted) {
      updatedNoteItem = desencryptNoteItem(cryptoSecret)(updatedNoteItem)
    }
    dispatch(actions.updateNoteSuccess({ note: updatedNoteItem }))
    return updatedNoteItem
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

export const encryptNotes = () => async (
  dispatch: Dispatch<PayloadAction>,
  getState: () => any
): Promise<NoteItem[] | undefined> => {
  const state = getState()

  dispatch(actions.encryptNotesStart())

  try {
    const cryptoSecret = selectCryptoSecret(state)
    const encryptedNoteDocuments = await noteApi.encryptNotes(cryptoSecret)
    const noteItems = encryptedNoteDocuments
      .map(noteDocumentToItem)
      .map(desencryptNoteItem(cryptoSecret))
    dispatch(actions.encryptNotesSuccess(noteItems))
    return noteItems
  } catch (error) {
    dispatch(actions.encryptNotesError({ error }))
    throw new Error(`Problem on encrypt notes: ${error.message}`)
  }
}

export const decryptNotes = () => (
  dispatch: Dispatch<PayloadAction>,
  getState: () => any
) => {
  const state = getState()
  const cryptoSecret = selectCryptoSecret(state)
  const notes = selectNotes(state)
  dispatch(actions.replaceNotes(notes.map(desencryptNoteItem(cryptoSecret))))
}

/* Selectors */

export const selectNotes = createSelector(['notes.items'])

export const selectNoteLoadingState = createSelector(
  ['notes'],
  state => ({
    isLoading: state.isLoading,
    isCreating: state.isCreating,
    isDeleting: state.isDeleting,
    isEncrypting: state.isEncrypting
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

const desencryptNoteItem = (cryptoSecret: string) => (
  noteItem: NoteItem
): NoteItem => {
  if (!cryptoSecret) return noteItem

  return {
    ...noteItem,
    content: decrypt(noteItem.content, cryptoSecret)
  }
}

const encryptNoteData = (cryptoSecret: string) => (
  data: noteApi.NoteDocumentData
): noteApi.NoteDocumentData => {
  if (!cryptoSecret) return data

  return {
    ...data,
    content: encrypt(data.content, cryptoSecret)
  }
}

export default reducer
