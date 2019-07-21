import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import faunadb from 'faunadb'
import { format } from 'timeago.js'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody
} from 'reactstrap'
import { runQuery } from './database'
import {
  GET_USER_NOTES,
  UPDATE_NOTE_CONTENT,
  CREATE_NOTE,
  DELETE_NOTE
} from './queries'
import { logout } from '../auth/authService'
import './index.css'
import { RouteComponentProps } from '@reach/router'

let timeouts: { [key: string]: number } = {}

type Note = {
  ref: faunadb.values.Ref
  ts: number
  data: {
    content: string
  }
}

const Notes: React.FC<RouteComponentProps> = ({ navigate }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [textareaValue, setTextareavalue] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null)
  const hasNotes = useMemo(() => notes && notes.length > 0, [notes])

  const sortedNotes = useMemo(() => {
    if (!notes) return null
    return notes.concat().sort((a, b) => b.ts - a.ts)
  }, [notes])

  useEffect(() => {
    runQuery(GET_USER_NOTES).then((result: any) => {
      setNotes(result.data)
    })
  }, [])

  const focusTextarea = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [])

  const handleNoteClick = useCallback(
    (note: Note) => {
      setSelectedNoteId(note.ref.id)
      setTextareavalue(note.data.content)
      focusTextarea()
    },
    [focusTextarea]
  )

  const updateNoteContent = useCallback(
    (noteId: string, updatedContent: string) => {
      if (!notes) return

      setNotes(
        notes.map(note => {
          if (note.ref.id === noteId) {
            return {
              ...note,
              data: {
                ...note.data,
                content: updatedContent
              }
            }
          }

          return note
        })
      )
    },
    [notes]
  )

  const saveNoteContent = useCallback((noteId: string, content: string) => {
    runQuery(UPDATE_NOTE_CONTENT(noteId, content))
  }, [])

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const updatedContent = event.currentTarget.value

      setTextareavalue(updatedContent)

      if (selectedNoteId) {
        updateNoteContent(selectedNoteId, updatedContent)

        window.clearInterval(timeouts[selectedNoteId])
        timeouts[selectedNoteId] = window.setTimeout(() => {
          saveNoteContent(selectedNoteId, updatedContent)
        }, 1000)
      }
    },
    [saveNoteContent, selectedNoteId, updateNoteContent]
  )

  const handleNewClick = useCallback(async () => {
    if (!notes) return
    setIsCreating(true)

    const newNote: any = await runQuery(CREATE_NOTE)

    setNotes(notes.concat(newNote))
    setSelectedNoteId(newNote.ref.id)
    setTextareavalue(newNote.data.content)
    setIsCreating(false)
    focusTextarea()
  }, [focusTextarea, notes])

  const handleDropdownClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
  }, [])

  const handleDeleteModalToggle = useCallback(() => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }, [isDeleteModalOpen])

  const handleNoteDelete = useCallback(
    async (note: Note, event: React.MouseEvent) => {
      event.stopPropagation()
      setNoteIdToDelete(note.ref.id)
      handleDeleteModalToggle()
    },
    [handleDeleteModalToggle]
  )

  const handleDeleteModalConfirm = useCallback(async () => {
    setIsDeleting(true)

    if (!notes || !noteIdToDelete) return

    await runQuery(DELETE_NOTE(noteIdToDelete))

    if (selectedNoteId === noteIdToDelete) setSelectedNoteId(null)
    setNotes(notes.filter(noteFilter => noteFilter.ref.id !== noteIdToDelete))
    handleDeleteModalToggle()
    setNoteIdToDelete(null)
    setIsDeleting(false)
  }, [handleDeleteModalToggle, noteIdToDelete, notes, selectedNoteId])

  const handleLogout = useCallback(() => {
    logout()
    navigate && navigate('/')
  }, [navigate])

  if (!sortedNotes)
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    )

  return (
    <>
      <div className="notes container-fluid">
        <div className="row">
          <div className="scrollable-y col-md-4 col-lg-3 bg-light p-3">
            <button
              onClick={handleNewClick}
              className="btn btn-block btn-primary mb-3"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'New note'}
            </button>

            {sortedNotes.map(note => (
              <div
                onClick={() => handleNoteClick(note)}
                className={`note card mb-1 ${note.ref.id === selectedNoteId &&
                  'note--active'}`}
                key={note.ref.id}
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
                    {note.data.content || (
                      <span className="text-muted">No content</span>
                    )}
                  </p>

                  <small className="note__info text-muted">
                    {format(note.ts / 1000)}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <div className="d-md-flex flex-column col-md-8 col-lg-9 p-3">
            <div className="row px-3 py-1 mb-3 justify-content-end">
              {/* <button className="btn btn-sm btn-outline-primary mr-1">
                Share note
              </button> */}

              <UncontrolledDropdown>
                <DropdownToggle outline color="secondary" size="sm" caret>
                  My account
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            {selectedNoteId ? (
              <textarea
                ref={textAreaRef}
                value={textareaValue}
                onChange={handleTextChange}
                placeholder="Type your note here..."
              />
            ) : (
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
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create your first note'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} toggle={handleDeleteModalToggle}>
        <ModalBody>
          <div className="p-4">
            <div className="text-center mb-3 lead">
              Do you really want to delete this note?
            </div>
            <div className="text-center">
              <button
                className="btn text-muted"
                onClick={handleDeleteModalToggle}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteModalConfirm}
                className="btn btn-outline-danger ml-1"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete note'}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Notes
