import * as boardService from '../services/board.service.js'
import { createBoardSchema } from '../validators/board.validator.js'

export const createBoard = async (req, res, next) => {
    try {
        const { title, workspaceId } = createBoardSchema.parse(req.body);
        const board = await boardService.createBoard({ title, workspaceId, userId: req.user.id });

        res.status(201).json({ success: true, data: board });
    } catch (err) {
        next(err);
    }
}

export const getBoardsByWorkspace = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const board = await boardService.getBoardsByWorkspace({ workspaceId, userId: req.user.id });

        res.status(200).json({ success: true, data: board })
    }
    catch (err) {
        next(err);
    }
}

export const getBoardById = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const board = await boardService.getBoardById({ boardId, userId: req.user.id })

        res.status(200).json({ success: true, data: board });
    } catch (err) {
        next(err);
    }
};

