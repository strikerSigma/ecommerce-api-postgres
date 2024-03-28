import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { FetchAnalytics, FetchCustomerbyID, FetchInbox, changeOrderStatus } from '../controllers/dashboardUrls';




let adminRouter = express.Router();

adminRouter.get('/analytics',authMiddleware, FetchAnalytics);
adminRouter.get('/inbox',authMiddleware, FetchInbox);
adminRouter.get('/customer/:id',authMiddleware, FetchCustomerbyID);
adminRouter.get('/change-order-status/:id',authMiddleware, changeOrderStatus);

 

export default adminRouter;