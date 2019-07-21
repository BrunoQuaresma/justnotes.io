import React, { useState, useCallback } from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import useForm from '../utils/useForm'
import { signIn } from './authService'

type SignInValues = {
  email: string
  password: string
}

const initialFormValues = {
  email: '',
  password: ''
}

const SignIn: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, fieldProps } = useForm<SignInValues>(initialFormValues)

  const loginUser = useCallback(
    async (values: SignInValues) => {
      setIsLoading(true)
      await signIn(values)
      navigate && navigate('/notes')
    },
    [navigate]
  )

  return (
    <div className="container h-100 d-flex align-items-center">
      <div className="row">
        <div className="col-lg-8">
          <h1 className="display-2 font-weight-bold">
            Welcome back to your notes app.{' '}
            <span className="text-muted font-weight-normal">
              Just simple, just notes.
            </span>
          </h1>
        </div>
        <div className="col-lg-4">
          <form onSubmit={handleSubmit(loginUser)}>
            <div className="form-group mt-4">
              <label htmlFor="email">E-mail</label>
              <input
                required
                autoFocus
                type="email"
                className="form-control"
                {...fieldProps('email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                required
                type="password"
                className="form-control"
                {...fieldProps('password')}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-dark btn-block" disabled={isLoading}>
                {isLoading ? 'Login...' : 'Login'}
              </button>
              <Link to="/register" className="btn btn-light btn-block">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
