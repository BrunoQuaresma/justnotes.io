import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  Fragment
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import ReactGA from 'react-ga'
import { format } from 'timeago.js'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody
} from 'reactstrap'
import { RouteComponentProps } from '@reach/router'
import { logout } from 'auth'
import { Note } from 'apis/noteApi'
import {
  selectNotes,
  selectLoadingState,
  fetchNotes,
  updateNoteById,
  createNote,
  deleteNoteById
} from 'stores/noteStore'
import { ThunkDispatch } from 'redux-thunk'

let timeouts: { [key: string]: number } = {}

const NotesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const notes: Note[] = useSelector(selectNotes)
  const loadingState = useSelector(selectLoadingState)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [textareaValue, setTextareavalue] = useState<string>('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null)
  const hasNotes = useMemo(() => notes && notes.length > 0, [notes])

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

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

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const updatedContent = event.currentTarget.value
      setTextareavalue(updatedContent)

      if (selectedNoteId) {
        window.clearInterval(timeouts[selectedNoteId])
        timeouts[selectedNoteId] = window.setTimeout(() => {
          dispatch(updateNoteById(selectedNoteId, { content: updatedContent }))
          ReactGA.event({
            category: 'Note',
            action: 'Update'
          })
        }, 1000)
      }
    },
    [dispatch, selectedNoteId]
  )

  const handleNewClick = useCallback(async () => {
    const newNote = await dispatch(createNote())

    if (!newNote) return

    ReactGA.event({
      category: 'Note',
      action: 'Create'
    })

    setSelectedNoteId(newNote.ref.id)
    setTextareavalue(newNote.data.content)
    focusTextarea()
  }, [dispatch, focusTextarea])

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
    if (!notes || !noteIdToDelete) return

    await dispatch(deleteNoteById(noteIdToDelete))

    ReactGA.event({
      category: 'Note',
      action: 'Delete'
    })

    if (selectedNoteId === noteIdToDelete) setSelectedNoteId(null)
    handleDeleteModalToggle()
    setNoteIdToDelete(null)
  }, [dispatch, handleDeleteModalToggle, noteIdToDelete, notes, selectedNoteId])

  const handleLogout = useCallback(() => {
    logout()
    ReactGA.event({
      category: 'User',
      action: 'Logout'
    })
    navigate && navigate('/')
  }, [navigate])

  if (loadingState.isLoading)
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    )

  return (
    <Fragment>
      <div className="notes container-fluid">
        <div className="row">
          <div className="scrollable-y col-md-4 col-lg-3 bg-light p-3">
            <button
              onClick={handleNewClick}
              className="btn btn-block btn-primary mb-3"
              disabled={loadingState.isCreating}
            >
              {loadingState.isCreating ? 'Creating...' : 'New note'}
            </button>

            {notes.map(note => (
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
            <div className="row px-3 py-1 mb-3">
              <UncontrolledDropdown className="ml-auto">
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
                      disabled={loadingState.isCreating}
                    >
                      {loadingState.isCreating
                        ? 'Creating...'
                        : 'Create your first note'}
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
                disabled={loadingState.isDeleting}
              >
                {loadingState.isDeleting ? 'Deleting...' : 'Delete note'}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default NotesPage
