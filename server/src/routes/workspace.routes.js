import express from 'express'
import { createWorkspace, getWorkspaces } from '../controllers/workspace.controller.js'
import {protect} from '../middlewares/auth.middleware.js'
const router = express.Router()

router.use(protect);    

router.post('/', createWorkspace)
router.get('/', getWorkspaces)

export default router;