import prisma from '../config/prisma.js'

export const createWorkspace = (data) =>{
    return prisma.workspace.create({ data });
}

export const findWorkspacebyUserId = (userId) =>{
    return prisma.workspace.findMany({
        where:{
            members:{
                some: {userId},
            },
        },
        orderBy:{
            createdAt: 'desc',
        }
    });
};

export const findWorkspacebyId = (id) =>{
    return prisma.workspaceMember.findUnique( {where: {id}, include:{ members:true }});
};

export const addMemberToWorkspace = (data) =>{
    return prisma.workspaceMember.create({ data });
};




export const findMembership = (userId, workspaceId) =>{
    return prisma.workspaceMember.findUnique({ 
        where: {
            userId_workspaceId: {userId, workspaceId}
        },
    });
};
