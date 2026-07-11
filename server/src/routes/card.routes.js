import express from 'express'
import {createCard, getCardById, getCardByListId, moveCard, updateCard, deleteCard, archiveCard, unarchiveCard,getArchivedCards } from '../controllers/card.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect);

router.post('/', createCard)
router.get('/:cardId', getCardById)
router.get('/list/:listId', getCardByListId)
router.patch('/:cardId/move', moveCard)
router.patch('/:cardId', updateCard)
router.delete('/:cardId',deleteCard)
router.patch('/:cardId/archive', archiveCard)
router.patch('/:cardId/unarchive', unarchiveCard)
router.get('/board/:boardId/archived', getArchivedCards)
export default router;