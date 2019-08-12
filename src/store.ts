import { configureStore } from 'redux-starter-kit'
import noteReducer from 'stores/noteStore'
import boardReducer from 'stores/boardStore'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    board: boardReducer
  }
})

export default store
