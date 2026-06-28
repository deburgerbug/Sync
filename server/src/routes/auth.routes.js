import express from 'express'
import {login, register} from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', register);
router.post('/login', login);

//temp test route
router.get('/temp', protect, (req, res)=>{
    res.json({
        success: true, 
        user: req.user
    });
});

export default router;

