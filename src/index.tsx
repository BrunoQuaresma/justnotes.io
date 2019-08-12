import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import cookies from 'js-cookie'
import faunadb from 'faunadb'
import App from 'components/App'
import * as serviceWorker from 'serviceWorker'
import * as auth from 'auth'
import * as event from 'event'
import * as noteApi from 'apis/noteApi'

const { REACT_APP_GA_ID, REACT_APP_FAUNADB_AUTH_KEY } = process.env

// Configure Google Analytics
if (REACT_APP_GA_ID) ReactGA.initialize(REACT_APP_GA_ID)

// Configure note
event.on(auth.events.startSession, (session: auth.AuthSession) => {
  noteApi.configure({
    client: new faunadb.Client({ secret: session.secret })
  })
})

// Configure auth
auth.configure({
  client: new faunadb.Client({
    secret: String(REACT_APP_FAUNADB_AUTH_KEY)
  }),
  storage: cookies,
  event
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
