import React, { Fragment, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectProfile, ProfileItem } from 'stores/profileStore'
import EncryptModal from 'components/EncryptModal'

const EncryptButton: React.FC = () => {
  const profile: ProfileItem = useSelector(selectProfile)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen)
  }, [isModalOpen])

  if (!profile) return <></>
  if (profile.preferences && profile.preferences.encrypted)
    return (
      <span className="text-secondary mr-2">
        <i className="fas fa-lock mr-1"></i> Encrypted
      </span>
    )

  return (
    <Fragment>
      <button onClick={toggleModal} className="btn btn-outline-success btn-sm">
        <i className="fas fa-lock mr-1"></i> Encrypt your notes
      </button>

      <EncryptModal isOpen={isModalOpen} toggle={toggleModal} />
    </Fragment>
  )
}

export default EncryptButton
