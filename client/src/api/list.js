import api from "./axios";
export const getListsByBoard = (boardId) => api.get(`lists/board/${boardId}`)
export const createList = (data) => api.post('lists', data)

