import React from 'react'
import ReactGA from 'react-ga'
import { createHistory, LocationProvider, Router } from '@reach/router'
import Notes from './notes/Notes'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import './styles/index.css'

// @ts-ignore
const history = createHistory(window)

history.listen(() => {
  ReactGA.pageview(window.location.pathname + window.location.search)
})

const App: React.FC = () => {
  return (
    <LocationProvider history={history}>
      <Router>
        <SignIn path="/" />
        <SignUp path="/register" />
        <Notes path="/notes" />
      </Router>
    </LocationProvider>
  )
}

export default App
