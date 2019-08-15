import { createSlice, createSelector, PayloadAction } from 'redux-starter-kit'
import { NoteItem, decryptNotes } from 'stores/noteStore'
import { ThunkDispatch } from 'redux-thunk'

type BoardState = {
  content: string
  selectedNoteId?: string
  noteIdToDelete?: string
  cryptoSecret?: string
}

const initialState: BoardState = {
  content: '',
  selectedNoteId: undefined,
  noteIdToDelete: undefined,
  cryptoSecret: undefined
}

const boardSlice = createSlice({
  initialState,
  slice: 'board',
  reducers: {
    selectNote: (state, action) => {
      const note: NoteItem = action.payload
      state.content = note.content
      state.selectedNoteId = note.id
    },
    updateContent: (state, action) => {
      state.content = action.payload
    },
    selectNoteToDelete: (state, action) => {
      const note: NoteItem = action.payload
      state.noteIdToDelete = note.id
    },
    clearDelete: state => {
      state.noteIdToDelete = undefined
    },
    unselectNote: state => {
      state.selectedNoteId = undefined
    },
    saveCryptoSecret: (state, action) => {
      state.cryptoSecret = action.payload
    },
    unsetCryptoSecret: state => {
      state.cryptoSecret = undefined
    }
  }
})

/* Actions */

export const setCryptoSecret = (cryptoSecret: string) => (
  dispatch: ThunkDispatch<any, any, PayloadAction>
) => {
  dispatch(actions.saveCryptoSecret(cryptoSecret))
  dispatch(decryptNotes())
}

/* Selectors */

export const selectBoard = createSelector(['board'])
export const selectCryptoSecret = createSelector(['board.cryptoSecret'])

const { actions, reducer } = boardSlice
export const {
  selectNote,
  updateContent,
  selectNoteToDelete,
  clearDelete,
  unselectNote,
  unsetCryptoSecret
} = actions
export default reducer
