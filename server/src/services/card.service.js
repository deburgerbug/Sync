import * as cardRepository from '../repositories/card.repository.js'
import * as listRepository from '../repositories/list.repository.js'
import * as boardService from '../services/board.service.js'
import * as workspaceService from '../services/workspace.service.js'
import AppError from '../utils/AppError.js'


export const createCard = async ({title, description, listId, userId}) => {
    const list = await listRepository.findListById(listId)

    if(!list) {
        throw new AppError('list not found', 404)
    }

    // get the board through the list 
    const board = await boardService.getBoardById({
        boardId: list.boardId,
        userId,
    });

    //verify workspace membership
    await workspaceService.verifyMembership( userId, board.workspaceId)
    const position = await cardRepository.countCardByListId( listId)
    return cardRepository.createCard( {title, description, listId, position})
}

export const getCardById = async({cardId, userId}) =>{
    const card = await cardRepository.findCardByListId(cardId);
    if(!card){
        throw new AppError('Card not found', 404)
    }

    const list = await listRepository.findListById(listId)
    const board = await boardService.getBoardById({
        boardId:board.listId, 
        userId
    })
    await workspaceService.verifyMembership(userId, board.workspaceId)
    return card;
}

export const getCardByListId = async({ listId, userId}) =>{
    const list = await listRepository.findListById( card.listId);

    if(!list) {
        throw new AppError('List not found', 404)
    }

    const board = await boardService.getBoardById({
        boardId: list.boardId,
        userId
    })
    await workspaceService.verifyMembership(userId, board.workspaceId)

    return cardRepository.findCardByListId(listId)
}
