import prisma from '../config/prisma.js'

export const createCard = (data) => {
    return prisma.card.create({
        data,
        include: {
            list: { select: { boardId: true } },
        }
    })
}

export const findCardByListId = (listId, includeArchived= false) => {
    return prisma.card.findMany({
    where: {
      listId,
      ...(includeArchived ? {} : { archived: false }),
        },
    orderBy: { position: 'asc' },
    });
}

export const findCardById = (id) => {
    return prisma.card.findUnique({
        where: { id }, include: {
            list: { select: { boardId: true } },
        },
    })
}

export const updateCard = (id, data) => {
    return prisma.card.update({
        where: { id }, data,
        include: {
            list: { select: { boardId: true } },
        },
    })
}

export const deleteCard = (id) => {
    return prisma.card.delete({ where: { id } })
}

export const countCardByListId = (listId) => {
    return prisma.card.count({ where: { listId } })
}

export const moveCard = (id, data) =>{
    return prisma.card.update({
        where:{id},
        data,
        include:{
            list:{ select: {boardId: true} },
        },
    });
};

export const archiveCard = (id) =>{
    return prisma.card.update({
        where: {id},
        data: {archived:true},
        include: {list: {select: {boardId:true}}}
    });
};

export const unarchiveCard = (id) =>{
    return prisma.card.update({
        where:{id},
        data: {archived:false},
        include: {list: {select: {boardId:true}}}
    });
};

export const getArchivedCardsByBoardId = (boardId) =>{
    return prisma.card.findMany({
        where:{
            archived: true,
            list: { boardId }
        },
        include:{list: {select: {title:true, boardId: true}}},
        orderBy:{createdAt: 'desc'}
    });
}