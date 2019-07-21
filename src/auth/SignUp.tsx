import React, { useCallback, useState } from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import ReactGA from 'react-ga'
import useForm from '../utils/useForm'
import { signUp } from './authService'

type SignUpValues = {
  email: string
  password: string
  confirmPassword: string
}

const initialFormValues = {
  email: '',
  password: '',
  confirmPassword: ''
}

const SignUp: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, fieldProps } = useForm<SignUpValues>(initialFormValues)

  const registerUser = useCallback(
    async (values: SignUpValues) => {
      setIsLoading(true)

      await signUp(values)

      ReactGA.event({
        category: 'User',
        action: 'Sign Up'
      })
      navigate && navigate('/notes')
    },
    [navigate]
  )

  return (
    <div className="container h-100">
      <div className="row py-3 py-lg-5">
        <div className="col">
          <span className="lead">
            <span className="font-weight-bold">justnotes</span>
            <span className="text-muted">.io</span>
          </span>
        </div>
      </div>

      <div className="row py-3 py-lg-5">
        <div className="col-lg-8">
          <h1 className="display-2 font-weight-bold">
            Welcome to your notes app.{' '}
            <span className="text-muted font-weight-normal">
              Just simple, just notes.
            </span>
          </h1>
        </div>
        <div className="col-lg-4">
          <form onSubmit={handleSubmit(registerUser)}>
            <div className="form-group mt-4">
              <label htmlFor="">E-mail</label>
              <input
                autoFocus
                required
                type="email"
                className="form-control"
                {...fieldProps('email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="">Password</label>
              <input
                required
                type="password"
                className="form-control"
                {...fieldProps('password')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="">Confirm password</label>
              <input
                required
                type="password"
                className="form-control"
                {...fieldProps('confirmPassword')}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-dark btn-block" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
              <Link to="/" className="btn btn-light btn-block">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <footer className="py-4">
        <p>
          We{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>
          Open Source.
          <a
            href="https://github.com/BrunoQuaresma/justnotes.io"
            className="ml-1"
          >
            Check here the source code.
          </a>
        </p>
      </footer>
    </div>
  )
}

export default SignUp
