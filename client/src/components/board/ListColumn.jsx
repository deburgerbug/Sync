import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { getCardsByList } from '../../api/card.js'
import CardItem from './CardItem.jsx'
import { deleteList } from '../../api/list.js'

export default function ListColumn({ list, activeCardForm, setActiveCardForm, cardTitle, setCardTitle, handleCreateCard }) {
  const queryClient = useQueryClient()

  const { data: cardsData } = useQuery({
    queryKey: ['cards', list.id],
    queryFn: () => getCardsByList(list.id),
  })

  const cards = cardsData?.data?.data || []

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { listId: list.id },
  })
  const handleDeleteList = async () => {
    try {
      await deleteList(list.id)
      queryClient.invalidateQueries(['lists'])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-72 shrink-0 bg-gray-100 rounded-lg p-3 shadow">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-semibold text-gray-800 text-sm">{list.title}</h3>
        <button
          onClick={handleDeleteList}
          className="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition"
        >
          🗑️
        </button>
      </div>
      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-2 mb-2 min-h-[2px]">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} listId={list.id} />
          ))}
        </div>
      </SortableContext>

      {activeCardForm === list.id ? (
        <form onSubmit={(e) => handleCreateCard(e, list.id)} className="mt-1">
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="Card title"
            className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={() => setActiveCardForm(null)}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setActiveCardForm(list.id)}
          className="w-full text-left text-gray-500 hover:text-gray-800 text-sm px-1 py-1 hover:bg-gray-200 rounded transition"
        >
          + Add a card
        </button>
      )}
    </div>
  )
}