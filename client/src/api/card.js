import api from "./axios";
export const getCardsByList = (listId) =>api.get(`/cards/list/${listId}`)
export const createCard = (data) =>api.post('/cards', data)
export const moveCard = (cardId,data) => api.patch(`/cards/${cardId}/move`, data )
export const updateCard = (cardId, data) =>api.patch(`/cards/${cardId}`, data)
export const deleteCard = (cardId) => api.delete(`/cards/${cardId}`)