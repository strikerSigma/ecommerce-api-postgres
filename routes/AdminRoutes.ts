import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { FetchAnalytics, FetchCustomerbyID, FetchInbox, changeOrderStatus, deleteProdcuts, dismissReview, editProduct, fetchCategory, fetchCustomers, fetchProdcuts, replyReview } from '../controllers/dashboardUrls';




let adminRouter = express.Router();

adminRouter.get('/analytics',authMiddleware, FetchAnalytics);
adminRouter.get('/products',authMiddleware, fetchProdcuts);
adminRouter.get('/inbox',authMiddleware, FetchInbox);
adminRouter.get('/customer/:id',authMiddleware, FetchCustomerbyID);
adminRouter.get('/change-order-status/:id',authMiddleware, changeOrderStatus);
adminRouter.get('/delete-product/:id',authMiddleware, deleteProdcuts);
adminRouter.get('/category/:id',authMiddleware, fetchCategory);
adminRouter.post('/edit-product/:id',authMiddleware, editProduct);
adminRouter.get('/customers',authMiddleware, fetchCustomers);
adminRouter.get('/notifications',authMiddleware, fetchCustomers);
adminRouter.post('/reply/:id',authMiddleware, replyReview);
adminRouter.get('/dismiss-review/:id',authMiddleware, dismissReview);


 

export default adminRouter;