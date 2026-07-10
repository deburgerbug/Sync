import * as listService from '../services/list.service.js'
import { createListSchema } from '../validators/list.validator.js'

export const createList = async(req, res, next) =>{
    try{
        const { title, boardId } = createListSchema.parse(req.body);
        const list = await listService.createList({title, boardId, userId: req.user.id})

        const io = req.app.get('io');
        io.to(list.boardId).emit('list:created', {list})
        
        res.status(201).json({
            success: true,
            data: list
        });
    }
    catch(err){
        next(err);
    };
};

export const getListByBoard = async(req, res, next) =>{
    try{
        const { boardId } = req.params;
        const list = await listService.getListsByBoard({boardId, userId: req.user.id});
        res.status(200).json({ success: true, data:list});
    }
    catch(err){
        next(err);
    };
}

export const getListById = async(req, res, next) =>{
    try{
        const {listId} = req.params;
        const list = await listService.getListById({listId, userId: req.user.id});
        res.status(200).json({success: true, data: list})
    }   
    catch(err){
        next(err);
    };
};

export const updateList = async(req, res, next) =>{
    try{
        const {listId} = req.params;
        const {title}  = req.body;

        const list = await listService.updateList({ listId, userId: req.user.id, title,})

        const io = req.app.get('io');
        io.to(list.boardId).emit('list:updated', {list});
        req.status(200).json({ success:true, data:list})
    }catch(err){
        next(err);
    }
};

export const deleteList = async(req, res, next) =>{
    try{
        const {listId} = req.params;
        const {boardId}= await listService.deleteList({listId, userId: req.user.id});

        const io = req.app.get('io');
        io.to(boardId).emit('list:deleted', {listId})

        res.status(200).json({ success:true });
    }catch(err){
        next(err);
    }
};