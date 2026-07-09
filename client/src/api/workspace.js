import api from "./axios"
export const getWorkspaces = () => api.get('/workspaces')
export const createWorkspace = (data) => api.post('/workspaces', data)