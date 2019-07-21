import React from 'react'
import { Router } from '@reach/router'
import Notes from './notes/Notes'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import './styles/index.css'

const App: React.FC = () => {
  return (
    <Router>
      <SignIn path="/" />
      <SignUp path="/register" />
      <Notes path="/notes" />
    </Router>
  )
}

export default App
