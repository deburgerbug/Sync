import prisma from '../config/prisma.js'

export const createCard = (data) =>{
    return prisma.card.create( {data})
}

export const findCardByListId = (listId) =>{
    return prisma.card.findMany( {where: {listId}, orderBy:{ position: 'asc'}})
}

export const findCardById = (id) =>{
    return prisma.card.findUnique({where : {id},})
}

export const updateCard = (id, data) =>{
    return prisma.card.update({ where: {id}, data})
}

export const deleteCard = (id) =>{
    return prisma.card.delete({ where: {id}})
}

export const countCardByListId = (listId) =>{
    return prisma.card.count( {where: {listId}})
}