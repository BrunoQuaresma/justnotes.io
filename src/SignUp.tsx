import React, { useCallback, useState } from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import useForm from './useForm'
import { signUp } from './auth'

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
      navigate && navigate('/notes')
    },
    [navigate]
  )

  return (
    <div className="container h-100 d-flex align-items-center">
      <div className="row">
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
    </div>
  )
}

export default SignUp
