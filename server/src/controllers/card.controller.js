import * as cardService from '../services/card.service.js'
import {createCardSchema} from '../validators/card.validator.js'
export const createCard = async(req, res, next ) =>{
    try{
        const { title, description, listId } =  createCardSchema.parse(req.body)
        const card = await cardService.createCard({title, description, listId, userId: req.user.id})
        res.status(201).json({
            success: true,
            data: card
        });
    }catch(err){
        next(err);
    }
};

export const getCardByListId = async(req, res, next) =>{
    try{
        const {listId} = req.params;
        const card = await cardService.getCardByListId({ listId, userId: req.user.id});
        res.status(200).json({
            success: true,
            data: card
        });
    }catch(err){
        next(err);
    }
};

export const getCardById = async(req, res, next) =>{
    try{
        const {cardId} = req.params;
        const card = await cardService.getCardById({ cardId, userId: req.user.id});
        res.status(200).json({
            success: true,
            data: card
        });
    }catch(err){
        next(err);
    }
};