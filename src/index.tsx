import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import cookies from 'js-cookie'
import faunadb from 'faunadb'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import * as Auth from './auth'

const { REACT_APP_GA_ID, REACT_APP_FAUNADB_AUTH_KEY } = process.env

// Configure Google Analytics
if (REACT_APP_GA_ID) ReactGA.initialize(REACT_APP_GA_ID)

// Configure Auth
Auth.configure({
  client: new faunadb.Client({
    secret: String(REACT_APP_FAUNADB_AUTH_KEY)
  }),
  storage: cookies
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
