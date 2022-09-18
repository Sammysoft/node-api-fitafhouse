import express from "express";
import {userController}  from "../controllers/user-controller.js";
import {auth} from '../controllers/auth.js';
import passport from 'passport';

const userRouter = express.Router();

userRouter.post('/onboarding', userController._onboard);
userRouter.post('/auth',auth._authUser );
userRouter.get('/dashboard', passport.authenticate('jwt', {session: false}), (req,res,next)=>{
    return res.status(200).json({
        data : req.user,
    })
})

userRouter.post('/invest/:id', userController._invest)
userRouter.get('/notifications/:id', userController._notifications)

export default userRouter;