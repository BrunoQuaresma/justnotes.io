import { configureStore } from 'redux-starter-kit'
import noteReducer from 'stores/noteStore'
import boardReducer from 'stores/boardStore'
import profileReducer from 'stores/profileStore'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    board: boardReducer,
    profile: profileReducer
  }
})

export default store
