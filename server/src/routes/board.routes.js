import express from 'express'
import {createBoard, getBoardsByWorkspace, getBoardById} from '../controllers/board.controller.js'

import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect);

router.post('/', createBoard);
router.get('/workspace/:workspace', getBoardsByWorkspace);
router.get('/:boardId', getBoardById);

export default router;