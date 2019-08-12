import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import { RouteComponentProps } from '@reach/router'
import {
  selectNotes,
  selectLoadingState,
  updateNoteById,
  createNote,
  NoteItem
} from 'stores/noteStore'
import { selectNote, updateContent, selectBoard } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'

let timeouts: { [key: string]: number } = {}

const BoardContent: React.FC<RouteComponentProps> = ({ navigate }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const notes: NoteItem[] = useSelector(selectNotes)
  const loadingState = useSelector(selectLoadingState)
  const boardState = useSelector(selectBoard)
  const hasNotes = useMemo(() => notes && notes.length > 0, [notes])

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = event.currentTarget.value
      dispatch(updateContent(newContent))

      const { selectedNoteId } = boardState
      window.clearInterval(timeouts[selectedNoteId])
      timeouts[selectedNoteId] = window.setTimeout(() => {
        dispatch(updateNoteById(selectedNoteId, { content: newContent }))
        ReactGA.event({
          category: 'Note',
          action: 'Update'
        })
      }, 1000)
    },
    [boardState, dispatch]
  )

  const handleNewClick = useCallback(async () => {
    const newNote = await dispatch(createNote())

    if (!newNote) return

    ReactGA.event({
      category: 'Note',
      action: 'Create'
    })

    dispatch(selectNote(newNote))
  }, [dispatch])

  if (!boardState.selectedNoteId)
    return (
      <div className="notes__empty h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="display-3 text-muted">
            {hasNotes ? 'Select a note' : 'Start use notes'}
          </p>

          {!hasNotes && (
            <button
              onClick={handleNewClick}
              className="btn btn-primary"
              type="button"
              disabled={loadingState.isCreating}
            >
              {loadingState.isCreating
                ? 'Creating...'
                : 'Create your first note'}
            </button>
          )}
        </div>
      </div>
    )

  return (
    <textarea
      value={boardState.content}
      onChange={handleTextChange}
      placeholder="Type your note here..."
    />
  )
}

export default BoardContent
