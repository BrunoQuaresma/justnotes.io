import { configureStore } from 'redux-starter-kit'
import noteReducer from 'stores/noteStore'

const store = configureStore({
  reducer: {
    notes: noteReducer
  }
})

export default store
