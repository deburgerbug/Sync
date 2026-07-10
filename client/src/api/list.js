import api from "./axios";
export const getListsByBoard = (boardId) => api.get(`lists/board/${boardId}`)
export const createList = (data) => api.post('lists', data)
export const updateList = (listId, data) =>api.patch(`lists/${listId}`, data)
export const deleteList = (listId) => api.delete(`/lists/${listId}`)
