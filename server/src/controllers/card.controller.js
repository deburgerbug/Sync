import * as cardService from '../services/card.service.js'
import {createCardSchema} from '../validators/card.validator.js'

export const createCard = async(req, res, next ) =>{
    try{
        console.log('\n🔵 CREATE CARD ENDPOINT CALLED');
        const { title, description, listId } =  createCardSchema.parse(req.body)
        console.log(`📝 Input: title=${title}, listId=${listId}`);
        
        const card = await cardService.createCard({title, description, listId, userId: req.user.id})
        console.log('✅ Card created:', JSON.stringify(card, null, 2));

        const io = req.app.get('io')
        if(!io) {
            console.error('❌ ERROR: io instance not found');
        } else {
            console.log('✅ io instance found');
        }
        
        console.log('📋 Card list:', card.list);
        console.log('🏢 Board ID:', card.list?.boardId);
        
        if(card.list?.boardId) {
            console.log(`📡 Attempting to emit 'card:created' to room: ${card.list.boardId}`);
            io.to(card.list.boardId).emit('card:created', { card })
            console.log(`✅ Emitted card:created to room: ${card.list.boardId}`);
        } else {
            console.error('❌ ERROR: No boardId found in card.list');
        }
        
        res.status(201).json({
            success: true,
            data: card
        });
    }catch(err){
        console.error('❌ Card creation error:', err);
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