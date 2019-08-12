import { createSlice, createSelector } from 'redux-starter-kit'
import { NoteItem } from 'stores/noteStore'

type BoardState = {
  content: string
  selectedNoteId?: string
  noteIdToDelete?: string
}

const initialState: BoardState = {
  content: '',
  selectedNoteId: undefined,
  noteIdToDelete: undefined
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
    clearSelect: state => {
      state.selectedNoteId = undefined
    }
  }
})

/* Selectors */

export const selectBoard = createSelector(['board'])

const { actions, reducer } = boardSlice
export const {
  selectNote,
  updateContent,
  selectNoteToDelete,
  clearDelete,
  clearSelect
} = actions
export default reducer
