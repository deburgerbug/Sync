import * as workspaceService from '../services/workspace.service.js'
import { createWorkspaceSchema} from '../validators/workspace.validator.js'
export const createWorkspace = async(req, res, next) =>{
    try{
        const { name } = createWorkspaceSchema.parse(req.body)
        const workspace = await  workspaceService.createWorkspace({ name, userId: req.user.id});
        res.status(201).json({ success: true, data: workspace});

    }catch(err){
        next(err);
    };

}

export const getWorkspaces = async(req, res, next) =>{
    try{
        const workspace = await workspaceService.getUserWorkspcae(req.user.id);
        res.status(200).json({
            success:true,
            data: workspace
        })
    }
    catch(err){
        next(err)
    }
};