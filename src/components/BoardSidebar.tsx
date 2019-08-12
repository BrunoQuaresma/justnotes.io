import React from 'react'
import { useSelector } from 'react-redux'
import { selectNotes, NoteItem } from 'stores/noteStore'
import NoteCard from 'components/NoteCard'
import NewNoteButton from 'components/NewNoteButton'

const BoardSidebar: React.FC = () => {
  const notes: NoteItem[] = useSelector(selectNotes)

  return (
    <div className="scrollable-y col-md-4 col-lg-3 bg-light p-3">
      <NewNoteButton label="New note" block></NewNoteButton>

      {notes.map(note => (
        <NoteCard note={note} key={note.id}></NoteCard>
      ))}
    </div>
  )
}

export default BoardSidebar
