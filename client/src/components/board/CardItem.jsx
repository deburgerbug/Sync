import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { updateCard, deleteCard } from '../../api/card.js'

export default function CardItem({ card, listId }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(card.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { card, listId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await updateCard(card.id, { title })
      queryClient.invalidateQueries(['cards', listId])
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCard(card.id)
      queryClient.invalidateQueries(['cards', listId])
    } catch (err) {
      console.error(err)
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="bg-white rounded p-2 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => { setIsEditing(false); setTitle(card.title); }}
            className="text-gray-500 text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded p-3 shadow-sm text-sm text-gray-800 cursor-grab active:cursor-grabbing hover:shadow-md transition group"
    >
      <div className="flex justify-between items-start">
        <span>{card.title}</span>
        <div className="hidden group-hover:flex gap-1 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="text-gray-400 hover:text-blue-500 text-xs"
          >
            ✏️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="text-gray-400 hover:text-red-500 text-xs"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}