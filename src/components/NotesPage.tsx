import React, {
  useEffect,
  Fragment,
  useMemo,
  useState,
  useCallback
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import { RouteComponentProps } from '@reach/router'
import { ThunkDispatch } from 'redux-thunk'
import { getSession } from 'auth'
import { fetchProfile, selectPreferences } from 'stores/profileStore'
import { rememberCryptoSecret, getRememberCryptoSecret } from 'crypt'
import { fetchNotes } from 'stores/noteStore'
import { setCryptoSecret, selectCryptoSecret } from 'stores/boardStore'
import BoardSidebar from 'components/BoardSidebar'
import BoardContent from 'components/BoardContent'
import BoardHeader from 'components/BoardHeader'
import NoteDeleteModal from 'components/NoteDeleteModal'
import useForm from 'hooks/useForm'

type SecretFormValues = {
  secret: string
  rememberSecret: boolean
}

const initialValues = {
  secret: '',
  rememberSecret: false
}

const NotesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const [isLoading, setIsLoading] = useState(true)
  const preferences = useSelector(selectPreferences)
  const session = useMemo(() => getSession(), [])
  const cryptoSecret = useSelector(selectCryptoSecret)
  const { fieldProps, handleSubmit } = useForm<SecretFormValues>(initialValues)

  useEffect(() => {
    if (!session) navigate && navigate('/')
  }, [navigate, session])

  useEffect(() => {
    const cryptoSecret = getRememberCryptoSecret()

    if (cryptoSecret) {
      dispatch(setCryptoSecret(cryptoSecret))
    }
  }, [dispatch])

  useEffect(() => {
    if (!session) return

    dispatch(fetchProfile())
      .then(() => dispatch(fetchNotes()))
      .finally(() => setIsLoading(false))
  }, [dispatch, session])

  const saveCryptoSecret = useCallback(
    ({ rememberSecret, secret }) => {
      dispatch(setCryptoSecret(secret))
      if (rememberSecret) rememberCryptoSecret(secret)
    },
    [dispatch]
  )

  if (isLoading)
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    )

  if (preferences && preferences.encrypted && !cryptoSecret) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="text-center my-5">
              <h1>Your notes are encrypted</h1>
              <h2 className="text-secondary font-weight-300 h3">
                To continue type your secret.
              </h2>
            </div>

            <form className="mx-md-5" onSubmit={handleSubmit(saveCryptoSecret)}>
              <div className="form-group">
                <label htmlFor="secret">Your secret</label>
                <input
                  {...fieldProps('secret')}
                  autoFocus
                  required
                  type="text"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <div className="form-check">
                  <input
                    {...fieldProps('rememberSecret')}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label htmlFor="rememberSecret" className="form-check-label">
                    Remember my secret on this device
                  </label>
                </div>
              </div>

              <div className="form-group">
                <button className="btn btn-success btn-block">
                  Use this secret
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="board container-fluid">
        <div className="row">
          <BoardSidebar></BoardSidebar>

          <div className="d-md-flex flex-column col-md-8 col-lg-9 p-3">
            <BoardHeader></BoardHeader>
            <BoardContent></BoardContent>
          </div>
        </div>
      </div>

      <NoteDeleteModal></NoteDeleteModal>
    </Fragment>
  )
}

export default NotesPage
