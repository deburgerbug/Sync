import express from 'express'
import {createCard, getCardById, getCardByListId, moveCard, updateCard, deleteCard, archiveCard, unarchiveCard,getArchivedCards } from '../controllers/card.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect);

router.post('/', createCard)
router.get('/list/:listId', getCardByListId)
router.get('/board/:boardId/archived', getArchivedCards)
router.patch('/:cardId/move', moveCard)
router.patch('/:cardId/archive', archiveCard)
router.patch('/:cardId/unarchive', unarchiveCard)
router.patch('/:cardId', updateCard)
router.delete('/:cardId',deleteCard)
router.get('/:cardId', getCardById)
export default router;