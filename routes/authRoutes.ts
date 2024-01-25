import express from 'express';
import { 
    createUser, 
    loginUserCtrl,
     deleteUser,
    //  updateUser,
    //  handleRefreshToken,
     logoutUser,
    //   updatePassword, resetPassword 
    }
     from '../controllers/userCtrl';
import {authMiddleware} from  '../middleware/authMiddleware';
let appRouter = express.Router();

appRouter.post('/register', createUser);
appRouter.post('/login', loginUserCtrl);
appRouter.get('/logout',authMiddleware, logoutUser);
// appRouter.post('/password',updatePassword);
// appRouter.post('/password-reset',resetPassword);
appRouter.delete('/:id',authMiddleware,deleteUser)
// appRouter.put('/:id',authMiddleware,updateUser)
// appRouter.get('/refresh',handleRefreshToken)
export default appRouter;