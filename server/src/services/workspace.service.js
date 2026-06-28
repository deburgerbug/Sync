import * as workspaceRepostitory from '../repositories/workspace.repository.js'
import AppError from '../utils/AppError.js'

export const createWorkspace = async({ name, userId}) =>{
    const workspace = await workspaceRepostitory.createWorkspace({name})

    await workspaceRepostitory.addMemberToWorkspace({
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
    });
    return workspace
}

export const getUserWorkspcae = async(userId) =>{
    return workspaceRepostitory.findWorkspacebyUserId(userId)
};

export const verifyMembership = async(workspaceId, userId) =>{
    const membership = await workspaceRepostitory.findMembership(workspaceId, userId)

    if(!membership){
        throw new AppError('You are not a member of this workspace ', 403)
    }
    return membership;
};
