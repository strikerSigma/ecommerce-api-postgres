import express from 'express';
import { 
    createUser, 
    loginUserCtrl,
     deleteUser,
    //  updateUser,
    //  handleRefreshToken,
     logoutUser,
     verifyUser,
    //   updatePassword, resetPassword 
    }
     from '../controllers/userCtrl';
import {authMiddleware} from  '../middleware/authMiddleware';
import { EditProfile } from '../controllers/otherCtrl';
let authRouter = express.Router();

authRouter.post('/register', createUser);
authRouter.post('/login', loginUserCtrl);
authRouter.get('/logout',authMiddleware, logoutUser);
authRouter.get('/verify-user',authMiddleware,verifyUser);
// appRouter.post('/password',updatePassword);
// appRouter.post('/password-reset',resetPassword);
authRouter.delete('/:id',authMiddleware,deleteUser);
authRouter.post('/update-account',authMiddleware, EditProfile);
// appRouter.put('/:id',authMiddleware,updateUser)
// appRouter.get('/refresh',handleRefreshToken)
export default authRouter;