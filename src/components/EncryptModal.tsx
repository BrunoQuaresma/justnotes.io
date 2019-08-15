import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import { ThunkDispatch } from 'redux-thunk'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { selectNoteLoadingState, encryptNotes } from 'stores/noteStore'
import { rememberCryptoSecret } from 'crypt'
import useForm from 'hooks/useForm'
import { setCryptoSecret } from 'stores/boardStore'

type EncryptModalProps = {
  isOpen: boolean
  toggle: () => void
}

type SecretFormValues = {
  secret: string
  rememberSecret: boolean
}

const initialValues = {
  secret: '',
  rememberSecret: false
}

const EncryptModal: React.FC<EncryptModalProps> = ({ isOpen, toggle }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const regularDispatch = useDispatch()
  const { fieldProps, handleSubmit } = useForm<SecretFormValues>(initialValues)
  const { isEncrypting } = useSelector(selectNoteLoadingState)

  const onSubmit = useCallback(
    async ({ secret, rememberSecret }: SecretFormValues) => {
      regularDispatch(setCryptoSecret(secret))
      await dispatch(encryptNotes())
      if (rememberSecret) rememberCryptoSecret(secret)
      toggle()
    },
    [dispatch, regularDispatch, toggle]
  )

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="p-4">
            <h4>Encrypt notes</h4>

            <p>
              Once you've set a secret, you have to remember it to access your
              notes again on this and other devices.
            </p>

            <div className="form-group">
              <label htmlFor="secret">Your secret</label>
              <input
                {...fieldProps('secret')}
                required
                type="text"
                className="form-control"
              />
            </div>

            <div className="form-check">
              <input
                {...fieldProps('rememberSecret')}
                className="form-check-input"
                type="checkbox"
              />
              <label
                htmlFor="rememberSecret"
                className="form-check-label text-secondary"
              >
                Remember my secret on this device
              </label>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button type="button" className="btn text-muted" onClick={toggle}>
            Cancel
          </button>

          <button className="btn btn-success ml-1" disabled={isEncrypting}>
            {isEncrypting ? 'Encrypting notes...' : 'Encrypt notes'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default EncryptModal
