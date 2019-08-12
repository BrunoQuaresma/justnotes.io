import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import { selectNotes, updateNoteById, NoteItem } from 'stores/noteStore'
import { updateContent, selectBoard } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'
import NewNoteButton from 'components/NewNoteButton'

const DEBOUNCE_TIMEOUT = 1000
let debounceTimeouts: { [key: string]: number } = {}

const BoardContent: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const notes: NoteItem[] = useSelector(selectNotes)
  const boardState = useSelector(selectBoard)
  const hasNotes = useMemo(() => notes && notes.length > 0, [notes])

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = event.currentTarget.value
      const { selectedNoteId } = boardState

      dispatch(updateContent(newContent))

      window.clearInterval(debounceTimeouts[selectedNoteId])
      debounceTimeouts[selectedNoteId] = window.setTimeout(() => {
        dispatch(updateNoteById(selectedNoteId, { content: newContent }))
        ReactGA.event({
          category: 'Note',
          action: 'Update'
        })
      }, DEBOUNCE_TIMEOUT)
    },
    [boardState, dispatch]
  )

  if (!boardState.selectedNoteId)
    return (
      <div className="notes__empty h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="display-3 text-muted">
            {hasNotes ? 'Select a note' : 'Start use notes'}
          </p>

          {!hasNotes && (
            <NewNoteButton label="Create your first note"></NewNoteButton>
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
