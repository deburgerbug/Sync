import { useQueryClient } from '@tanstack/react-query'
import { unarchiveCard } from '../../api/card.js'

export default function ArchivedCardItem({ card, boardId }) {
  const queryClient = useQueryClient()

  const handleUnarchive = async () => {
    try {
      await unarchiveCard(card.id)
      queryClient.invalidateQueries(['cards', card.listId])
      queryClient.invalidateQueries(['cards', boardId, 'archived'])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-blue-800 rounded p-3 text-sm text-white flex items-center gap-3">
      <div>
        <p className="font-medium">{card.title}</p>
        <p className="text-blue-300 text-xs">in {card.list.title}</p>
      </div>
      <button
        onClick={handleUnarchive}
        className="text-blue-300 hover:text-white text-xs border border-blue-600 rounded px-2 py-1 hover:border-blue-400 transition"
      >
        Restore
      </button>
    </div>
  )
}