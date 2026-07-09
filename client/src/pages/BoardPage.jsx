import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { getListsByBoard, createList } from '../api/list.js'
import { createCard, moveCard } from '../api/card.js'
import ListColumn from '../components/board/ListColumn.jsx'

export default function BoardPage() {
  const { boardId } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showListForm, setShowListForm] = useState(false)
  const [listTitle, setListTitle] = useState('')
  const [activeCardForm, setActiveCardForm] = useState(null)
  const [cardTitle, setCardTitle] = useState('')
  const [presence, setPresence] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px drag before activating
    })
  )

  useSocket(boardId, {
    onCardCreated: ({ card }) => {
      queryClient.invalidateQueries(['cards', card.listId])
    },
    onListCreated: () => {
      queryClient.invalidateQueries(['lists', boardId])
    },
    onCardMoved: ({ cardId, listId, position }) => {
      // Invalidate both the source and destination lists
      queryClient.invalidateQueries(['cards'])
    },
    onPresenceJoined: ({ user }) => {
      setPresence((prev) => {
        if (prev.find((u) => u.id === user.id)) return prev
        return [...prev, user]
      })
    },
    onPresenceLeft: ({ user }) => {
      setPresence((prev) => prev.filter((u) => u.id !== user.id))
    },
  })

  const { data: listsData, isLoading } = useQuery({
    queryKey: ['lists', boardId],
    queryFn: () => getListsByBoard(boardId),
  })

  const lists = listsData?.data?.data || []

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return // dropped outside a droppable

    const cardId = active.id
    const overId = over.id // could be a listId or another cardId

    // Find which list the card was dragged over
    // over.id is the listId when dropped on empty list,
    // or a cardId when dropped on another card
    const targetListId = over.data?.current?.listId || overId

    if (!targetListId) return

    // Find position — simple approach: drop at end of list
    const targetCards = queryClient.getQueryData(['cards', targetListId])
    const position = targetCards?.data?.data?.length ?? 0

    // Optimistic update — move card in UI instantly
    queryClient.setQueryData(['cards', targetListId], (old) => {
      if (!old) return old
      const card = active.data?.current?.card
      if (!card) return old
      return {
        ...old,
        data: {
          ...old.data,
          data: [...(old.data?.data || []), { ...card, listId: targetListId, position }],
        },
      }
    })

    try {
      await moveCard(cardId, { listId: targetListId, position })
      // Refresh both lists after server confirms
      queryClient.invalidateQueries(['cards'])
    } catch (err) {
      console.error('Move failed:', err)
      queryClient.invalidateQueries(['cards'])
    }
  }

  const handleCreateList = async (e) => {
    e.preventDefault()
    if (!listTitle.trim()) return
    try {
      await createList({ title: listTitle, boardId })
      queryClient.invalidateQueries(['lists', boardId])
      setListTitle('')
      setShowListForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateCard = async (e, listId) => {
    e.preventDefault()
    if (!cardTitle.trim()) return
    try {
      await createCard({ title: cardTitle, listId })
      queryClient.invalidateQueries(['cards', listId])
      setCardTitle('')
      setActiveCardForm(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col">
      <nav className="px-6 py-3 flex justify-between items-center bg-blue-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workspaces')}
            className="text-blue-200 hover:text-white text-sm"
          >
            ← Workspaces
          </button>
          <span className="text-white font-semibold">Board</span>
        </div>
        <div className="flex items-center gap-3">
          {presence.map((u) => (
            <div
              key={u.id}
              title={u.name}
              className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold text-white"
            >
              {u.name[0].toUpperCase()}
            </div>
          ))}
          <span className="text-blue-200 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-blue-300 hover:text-white text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-x-auto p-6">
        {isLoading ? (
          <p className="text-white">Loading board...</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 items-start">
              {lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  activeCardForm={activeCardForm}
                  setActiveCardForm={setActiveCardForm}
                  cardTitle={cardTitle}
                  setCardTitle={setCardTitle}
                  handleCreateCard={handleCreateCard}
                />
              ))}

              <div className="w-72 shrink-0">
                {showListForm ? (
                  <form
                    onSubmit={handleCreateList}
                    className="bg-white rounded-lg p-3 shadow"
                  >
                    <input
                      type="text"
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      placeholder="List title"
                      className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Add List
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowListForm(false)}
                        className="text-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowListForm(true)}
                    className="w-full text-left bg-blue-600 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                  >
                    + Add a list
                  </button>
                )}
              </div>
            </div>
          </DndContext>
        )}
      </div>
    </div>
  )
}