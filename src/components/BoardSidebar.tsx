import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import {
  selectNotes,
  selectLoadingState,
  createNote,
  NoteItem
} from 'stores/noteStore'
import { selectNote } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'
import NoteCard from 'components/NoteCard'

const BoardSidebar: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const notes: NoteItem[] = useSelector(selectNotes)
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
    <div className="scrollable-y col-md-4 col-lg-3 bg-light p-3">
      <button
        onClick={handleNewClick}
        className="btn btn-block btn-primary mb-3"
        disabled={loadingState.isCreating}
      >
        {loadingState.isCreating ? 'Creating...' : 'New note'}
      </button>

      {notes.map(note => (
        <NoteCard note={note} key={note.id}></NoteCard>
      ))}
    </div>
  )
}

export default BoardSidebar
