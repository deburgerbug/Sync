import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkspaces, createWorkspace } from '../api/workspace.js'
import { getBoardsByWorkspace, createBoard } from '../api/board.js'

export default function WorkspacePage(){
    const {user, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedWorkspace, setSelectedWorkspace] = useState(null)
    const [showWorkspaceForm, setShowWorkspaceForm] = useState(false)
    const [showBoardForm, setShowBoardForm] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('')
    const [boardTitle, setBoardTitle] = useState('')

    //Fetch workspaces
    const {data: workspacesData, isLoading:loadingWorkspaces } = useQuery({
        queryKey: ['workspaces'],
        queryFn: getWorkspaces,
    })

    //Fetch boards for selected workspaces
    const {data: boardsData, isLoading: loadingBoards, } = useQuery({
        queryKey: ['boards', selectedWorkspace?.id],
        queryFn: () =>getBoardsByWorkspace(selectedWorkspace.id),
        enabled: !! selectedWorkspace
    })

    //Worksapce mutation
    const createWorkspaceMutaion = useMutation({
        mutationFn: createWorkspace,
        onSuccess: () =>{
            queryClient.invalidateQueries(['workspaces'])
            setWorkspaceName('')
            setShowWorkspaceForm(false)
        },
    })

    // board mutation
    const createBoardMutation = useMutation({
        mutationFn: createBoard,
        onSuccess: () =>{
            queryClient.invalidateQueries(['boards', selectedWorkspace?.id])
            setBoardTitle('')
            setShowBoardForm(false)
        },
    })

    const handleCreateWorkspace = (e) =>{
        e.preventDefault()
        if(!workspaceName.trim()) return 
        createWorkspaceMutaion.mutate({name: workspaceName})
    }

    const handleCreateBoard = (e) =>{
        e.preventDefault()
        if(!boardTitle.trim()) return
        createBoardMutation.mutate({ title: boardTitle, workspaceId: selectedWorkspace.id})
    }

    const workspaces = workspacesData?.data?.data || []
    const boards = boardsData?.data?.data || []

      return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Sync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar — workspaces */}
        <aside className="w-64 bg-white border-r p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Workspaces
            </h2>
            <button
              onClick={() => setShowWorkspaceForm(!showWorkspaceForm)}
              className="text-blue-500 text-xl font-bold leading-none hover:text-blue-700"
            >
              +
            </button>
          </div>

          {showWorkspaceForm && (
            <form onSubmit={handleCreateWorkspace} className="flex gap-1 mb-2">
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Workspace name"
                className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                Add
              </button>
            </form>
          )}

          {loadingWorkspaces ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setSelectedWorkspace(ws)}
                className={`text-left px-3 py-2 rounded text-sm font-medium transition ${
                  selectedWorkspace?.id === ws.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {ws.name}
              </button>
            ))
          )}
        </aside>

        {/* Main — boards */}
        <main className="flex-1 p-6">
          {!selectedWorkspace ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a workspace to view boards
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedWorkspace.name}
                </h2>
                <button
                  onClick={() => setShowBoardForm(!showBoardForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                >
                  + New Board
                </button>
              </div>

              {showBoardForm && (
                <form onSubmit={handleCreateBoard} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={boardTitle}
                    onChange={(e) => setBoardTitle(e.target.value)}
                    placeholder="Board title"
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
                  >
                    Create
                  </button>
                </form>
              )}

              {loadingBoards ? (
                <p className="text-sm text-gray-400">Loading boards...</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-800">{board.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(board.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {boards.length === 0 && (
                    <p className="text-sm text-gray-400 col-span-3">
                      No boards yet — create one to get started.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
