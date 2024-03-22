import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { FetchAnalytics } from '../controllers/dashboardUrls';




let adminRouter = express.Router();

adminRouter.get('/analytics',authMiddleware, FetchAnalytics);

 

export default adminRouter;