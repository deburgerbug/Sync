import api from "./axios";
export const getCardsByList = (listId) =>api.get(`/cards/list/${listId}`)
export const createCard = (data) =>api.post('/cards', data)
export const moveCard = (cardId,data) => api.patch(`/cards/${cardId}/move`, data )