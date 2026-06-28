import prisma from '../config/prisma.js'

export const createBoard = (data)=>{
    return prisma.board.create({ data })
};

export const findBoardsByWorkspaceId = (workspaceId)=>{
    return prisma.board.findMany( {where: { workspaceId}})
};

export const findBoardById = (id) =>{
    return prisma.board.findUnique({
        where: { id },
        include: {
            list: {
                orderBy: { position: 'asc' },
                include: {
                    cards:{
                        orderBy: { position: 'asc'}
                    },
                },
            },
        },
    });
};
