import prisma from '../config/prisma.js'

export const createList = (data) =>{
    return prisma.list.create({ data });
};

export const findListByBoardId = (boardId) =>{
    return prisma.list.findMany({where: {boardId}, orderBy: { position: 'asc'} })
}
export const findListById = (id) =>{
    return prisma.list.findUnique({
        where: {id},
    });
};

export const updateList = (id,data) =>{
    return prisma.list.update({
        where: {id},
        data,
    });
};

export const deleteList = (id) =>{
    return prisma.list.delete({
        where: {id},
    });
};

export const countListByBoardId = (boardId) =>{
    return prisma.list.count({where: {boardId}});
}