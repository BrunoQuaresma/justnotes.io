import React from 'react'
import ReactGA from 'react-ga'
import { createHistory, LocationProvider, Router } from '@reach/router'
import { Provider } from 'react-redux'
import store from 'store'
import NotesPage from 'components/NotesPage'
import SignInPage from 'components/SignInPage'
import SignUpPage from 'components/SignUpPage'
import 'styles/index.css'

// @ts-ignore
export const history = createHistory(window)
history.listen(() => {
  ReactGA.pageview(window.location.pathname + window.location.search)
})

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <LocationProvider history={history}>
        <Router>
          <SignInPage path="/" />
          <SignUpPage path="/register" />
          <NotesPage path="/notes" />
        </Router>
      </LocationProvider>
    </Provider>
  )
}

export default App
