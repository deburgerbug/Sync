import * as authService from '../services/auth.service.js'

import { loginSchema, registerSchema} from '../validators/auth.validator.js'

export const register = async (req, res, next) =>{
    try{
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.registerUser(validatedData);
        res.status(201).json({ success: true, data: result })
    }
    catch(err){
        next(err)
    }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
