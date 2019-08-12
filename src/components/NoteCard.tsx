import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import { format } from 'timeago.js'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { NoteItem } from 'stores/noteStore'
import { selectNote, selectBoard, selectNoteToDelete } from 'stores/boardStore'
import { ThunkDispatch } from 'redux-thunk'

type NoteCardProps = {
  note: NoteItem
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const boardState = useSelector(selectBoard)

  const handleNoteClick = useCallback(
    (note: NoteItem) => {
      dispatch(selectNote(note))
    },
    [dispatch]
  )

  const handleDropdownClick = useCallback(
    (event: React.MouseEvent) => event.stopPropagation(),
    []
  )

  const handleNoteDelete = useCallback(
    (note: NoteItem, event: React.MouseEvent) => {
      event.stopPropagation()
      dispatch(selectNoteToDelete(note))
    },
    [dispatch]
  )

  return (
    <div
      onClick={() => handleNoteClick(note)}
      className={`note card mb-1 ${note.id === boardState.selectedNoteId &&
        'note--active'}`}
      key={note.id}
    >
      <div className="card-body">
        <div className="note__options">
          <UncontrolledDropdown>
            <DropdownToggle
              color="light"
              size="sm"
              onClick={handleDropdownClick}
            >
              <i className="fas fa-ellipsis-h" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header>Actions</DropdownItem>
              <DropdownItem
                className="text-danger"
                onClick={event => handleNoteDelete(note, event)}
              >
                Remove
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        <p className="note__content">
          {note.content || <span className="text-muted">No content</span>}
        </p>

        <small className="note__info text-muted">
          {format(note.ts / 1000)}
        </small>
      </div>
    </div>
  )
}

export default NoteCard
