import express from 'express'
import {createCard, getCardById, getCardByListId, moveCard} from '../controllers/card.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect);

router.post('/', createCard)
router.get('/:cardId', getCardById)
router.get('/list/:listId', getCardByListId)
router.patch('/:cardId/move', moveCard)
export default router;