import React, { useEffect, Fragment, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PayloadAction } from 'redux-starter-kit'
import { RouteComponentProps } from '@reach/router'
import { ThunkDispatch } from 'redux-thunk'
import { selectNoteLoadingState, fetchNotes } from 'stores/noteStore'
import BoardSidebar from 'components/BoardSidebar'
import BoardContent from 'components/BoardContent'
import BoardHeader from 'components/BoardHeader'
import NoteDeleteModal from 'components/NoteDeleteModal'
import { getSession } from 'auth'
import { fetchProfile, selectProfileLoading } from 'stores/profileStore'

const NotesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, PayloadAction>>()
  const noteLoadingState = useSelector(selectNoteLoadingState)
  const isProfileLoading = useSelector(selectProfileLoading)
  const session = useMemo(() => getSession(), [])

  useEffect(() => {
    if (!session) {
      navigate && navigate('/')
    }
  }, [navigate, session])

  useEffect(() => {
    if (session) {
      dispatch(fetchNotes())
      dispatch(fetchProfile())
    }
  }, [dispatch, session])

  if (noteLoadingState.isLoading || isProfileLoading)
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    )

  return (
    <Fragment>
      <div className="board container-fluid">
        <div className="row">
          <BoardSidebar></BoardSidebar>

          <div className="d-md-flex flex-column col-md-8 col-lg-9 p-3">
            <BoardHeader></BoardHeader>
            <BoardContent></BoardContent>
          </div>
        </div>
      </div>

      <NoteDeleteModal></NoteDeleteModal>
    </Fragment>
  )
}

export default NotesPage
