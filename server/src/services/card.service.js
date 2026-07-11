import * as cardRepository from '../repositories/card.repository.js'
import * as boardRepository from '../repositories/board.repository.js'
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
    const card = await cardRepository.createCard( {title, description, listId, position})
    return card;
}

export const getCardById = async({cardId, userId}) =>{
    // find the card by its unique id
    const card = await cardRepository.findCardById(cardId);
    if(!card){
        throw new AppError('Card not found', 404)
    }

    // get the list and board via the card
    const list = await listRepository.findListById(card.listId)
    const board = await boardService.getBoardById({
        boardId: list.boardId,
        userId
    })
    await workspaceService.verifyMembership(userId, board.workspaceId)
    return card;
}

export const getCardByListId = async({ listId, userId}) =>{
    // verify list exists
    const list = await listRepository.findListById(listId);

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

export const moveCard = async({ cardId, listId, position, userId}) =>{
    const card = await cardRepository.findCardById(cardId);

    if(!card) throw new AppError('Card not found', 404);
    const list = await listRepository.findListById(card.listId);
    const board = await boardRepository.findBoardById(list.boardId);
    await workspaceService.verifyMembership(userId, board.workspaceId);

    return cardRepository.moveCard(cardId, {listId, position});
};

export const updateCard = async({cardId, userId, title, description }) =>{
    const card = await cardRepository.findCardById(cardId)
    if(!card) throw new AppError('Card Not Found', 404)

    const list = await listRepository.findListById(card.listId)
    const board = await boardRepository.findBoardById(list.boardId)
    await workspaceService.verifyMembership(userId, board.workspaceId)

    return cardRepository.updateCard(cardId, {title, description})
};

export const deleteCard = async({cardId, userId}) =>{
    const card = await cardRepository.findCardById(cardId);
    if(!card) throw new AppError('Card not Found', 404);

    const list = await listRepository.findListById(card.listId);
    const board = await boardRepository.findBoardById(list.boardId);
    await workspaceService.verifyMembership(userId, board.workspaceId);
    await cardRepository.deleteCard(cardId);
    
    return { boardId: board.id, listId: card.listId};
};

export const archiveCard = async({cardId, userId}) =>{
    const card = await cardRepository.findCardById(cardId)
    if(!card) throw new AppError('Card not found', 404)
    const list = await listRepository.findListById(card.listId)
    const board = await boardRepository.findBoardById(list.boardId)

    await workspaceService.verifyMembership(userId, board.workspaceId)

    return cardRepository.archiveCard(cardId)
}

export const unarchiveCard = async({cardId, userId}) =>{
    const card = await cardRepository.findCardById(cardId)
    if(!card) throw new AppError('Card not found', 404);

    const list = await listRepository.findListById(card.listId);
    const board = await boardRepository.findBoardById(list.boardId)
    await workspaceService.verifyMembership(userId, board.workspaceId)

    return cardRepository.unarchiveCard(cardId)
}

export const getArchivedCards = async({boardId, userId}) =>{
    const board = await boardRepository.findBoardById(boardId)
    if(!board) throw new AppError('Board not found', 404);
    
    await workspaceService.verifyMembership(userId, board.workspaceId);

    return cardRepository.getArchivedCardsByBoardId(boardId)
}