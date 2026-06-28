import * as boardRepository from '../repositories/board.repository.js';
import * as workspaceService from '../services/workspace.service.js';
import AppError from '../utils/AppError.js';

export const createBoard = async ({ title, workspaceId, userId }) => {
  await workspaceService.verifyMembership(userId, workspaceId);
  return boardRepository.createBoard({ title, workspaceId });
};

export const getBoardsByWorkspace = async ({ workspaceId, userId }) => {
  await workspaceService.verifyMembership(userId, workspaceId);
  return boardRepository.findBoardsByWorkspaceId(workspaceId);
};

export const getBoardById = async ({ boardId, userId }) => {
  const board = await boardRepository.findBoardById(boardId);

  if (!board) {
    throw new AppError('Board not found!', 404);
  }

  await workspaceService.verifyMembership(userId, board.workspaceId);

  return board;
};