import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import { Modal, ModalBody } from 'reactstrap'
import { selectLoadingState, deleteNoteById } from 'stores/noteStore'
import { selectBoard, clearDelete, unselectNote } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'

const NotesPage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const loadingState = useSelector(selectLoadingState)
  const boardState = useSelector(selectBoard)

  const handleNoteDeleteCancel = useCallback(() => {
    dispatch(clearDelete())
  }, [dispatch])

  const handleDeleteModalConfirm = useCallback(async () => {
    const { selectedNoteId, noteIdToDelete } = boardState
    await dispatch(deleteNoteById(noteIdToDelete))
    ReactGA.event({
      category: 'Note',
      action: 'Delete'
    })
    if (selectedNoteId === noteIdToDelete) {
      dispatch(unselectNote())
    }
    dispatch(clearDelete())
  }, [boardState, dispatch])

  return (
    <Modal isOpen={!!boardState.noteIdToDelete} toggle={handleNoteDeleteCancel}>
      <ModalBody>
        <div className="p-4">
          <div className="text-center mb-3 lead">
            Do you really want to delete this note?
          </div>
          <div className="text-center">
            <button className="btn text-muted" onClick={handleNoteDeleteCancel}>
              Cancel
            </button>
            <button
              onClick={handleDeleteModalConfirm}
              className="btn btn-outline-danger ml-1"
              disabled={loadingState.isDeleting}
            >
              {loadingState.isDeleting ? 'Deleting...' : 'Delete note'}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default NotesPage
