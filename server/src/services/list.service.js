import * as listRepository from '../repositories/list.repository.js'
import * as boardRepository from '../repositories/board.repository.js'
import * as boardService from './board.service.js'
import * as workspaceService from './workspace.service.js'
import AppError from '../utils/AppError.js'

export const createList = async({ title, boardId, userId}) =>{
    const board = await boardRepository.findBoardById(boardId, userId)
    
    if (!board){
        throw new AppError('Board not found', 404)
    }

    await workspaceService.verifyMembership(userId, board.workspaceId);
    const position = await listRepository.countListByBoardId(boardId);
    return listRepository.createList({ title, boardId, position});
}   

export const getListsByBoard = async({ boardId, userId}) =>{
    const board = await boardService.getBoardById({ boardId, userId })
    await workspaceService.verifyMembership( userId, board.workspaceId);
    return listRepository.findListByBoardId(boardId);
}

export const getListById = async({ listId, userId }) =>{
    const list = await listRepository.findListById(listId);

    if(!list){
        throw new AppError('List not found', 404)
    }
    const board = await boardService.getBoardById({ boardId: list.boardId, userId })
    await workspaceService.verifyMembership(userId, board.workspaceId)
    return list;
};
