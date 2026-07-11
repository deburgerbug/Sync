import api from "./axios";
export const getCardsByList = (listId) =>api.get(`/cards/list/${listId}`)
export const createCard = (data) =>api.post('/cards', data)
export const moveCard = (cardId,data) => api.patch(`/cards/${cardId}/move`, data )
export const updateCard = (cardId, data) =>api.patch(`/cards/${cardId}`, data)
export const deleteCard = (cardId) => api.delete(`/cards/${cardId}`)
export const archiveCard= (cardId) =>api.patch(`cards/${cardId}/archive`)
export const unarchiveCard= (cardId) =>api.patch(`cards/${cardId}/unarchive`)
export const getArchiveCards = (boardId) => api.get(`/cards/board/${boardId}/archived`)