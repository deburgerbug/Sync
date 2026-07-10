import express from 'express'
import { createList, getListByBoard, getListById, updateList, deleteList} from '../controllers/list.controller.js'
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createList);
router.get('/board/:boardId', getListByBoard);
router.get('/:listId', getListById);
router.patch('/:listId', updateList)
router.delete('/:listId', deleteList)

export default router;