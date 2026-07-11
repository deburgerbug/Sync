import api from "./axios";
export const getBoardsByWorkspace = (workspaceId) => api.get(`/boards/workspace/${workspaceId}`)
export const createBoard = (data) =>api.post('/boards', data)