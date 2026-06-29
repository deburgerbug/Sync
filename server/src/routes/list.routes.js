import express from 'express'
import { createList, getListByBoard, getListById} from '../controllers/list.controller.js'
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createList);
router.get('/board/:boardId', getListByBoard);
router.get('/:listId', getListById);

export default router;