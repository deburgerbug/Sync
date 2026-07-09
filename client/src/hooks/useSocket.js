import { useEffect, useRef } from 'react'
import socket from '../socket/socket.js'
import { useAuth } from '../context/AuthContext.jsx'

export const useSocket = (boardId, handlers = {}) => {
  const { token } = useAuth()
  const handlersRef = useRef(handlers)

  // Keep handlersRef current on every render without triggering effect
  useEffect(() => {
    handlersRef.current = handlers
  })

  useEffect(() => {
    if (!token || !boardId) return

    socket.auth = { token }
    socket.connect()
    socket.emit('board:join', { boardId })

    const onCardCreated = (data) => handlersRef.current.onCardCreated?.(data)
    const onListCreated = (data) => handlersRef.current.onListCreated?.(data)
    const onPresenceJoined = (data) => handlersRef.current.onPresenceJoined?.(data)
    const onPresenceLeft = (data) => handlersRef.current.onPresenceLeft?.(data)
    const onCardMoved = (data) => handlersRef.current.onCardMoved?.(data)

    socket.on('card:created', onCardCreated)
    socket.on('list:created', onListCreated)
    socket.on('presence:joined', onPresenceJoined)
    socket.on('presence:left', onPresenceLeft)
    socket.on('card:moved', onCardMoved)

    return () => {
      socket.emit('board:leave', { boardId })
      socket.off('card:created', onCardCreated)
      socket.off('list:created', onListCreated)
      socket.off('presence:joined', onPresenceJoined)
      socket.off('presence:left', onPresenceLeft)
      socket.off('card:moved', onCardMoved)
      socket.disconnect()
    }
  }, [boardId, token]) // ✅ only re-run when boardId or token changes
}