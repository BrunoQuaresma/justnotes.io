import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import { selectLoadingState, createNote } from 'stores/noteStore'
import { selectNote } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'

type NewNoteButtonProps = {
  label: string
  block?: boolean
}

const NewNoteButton: React.FC<NewNoteButtonProps> = ({ label, block }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const loadingState = useSelector(selectLoadingState)

  const handleNewClick = useCallback(async () => {
    const newNote = await dispatch(createNote())
    if (!newNote) return

    ReactGA.event({
      category: 'Note',
      action: 'Create'
    })

    dispatch(selectNote(newNote))
  }, [dispatch])

  return (
    <button
      onClick={handleNewClick}
      className={`btn ${block && 'btn-block'} btn-primary mb-3`}
      disabled={loadingState.isCreating}
    >
      {loadingState.isCreating ? 'Creating...' : label}
    </button>
  )
}

export default NewNoteButton
