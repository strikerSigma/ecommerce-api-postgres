import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { fetchCart, fetchProducts, fetchProductsById, fetchProductsCategory } from '../controllers/fetchCtrl';
import { AddtoCart, createProduct } from '../controllers/otherCtrl';
let appRouter = express.Router();

appRouter.get('/products', fetchProducts);
appRouter.get('/products-category', fetchProductsCategory);
appRouter.get('/cart',authMiddleware, fetchCart);
appRouter.get('/products/:id', fetchProductsById);
appRouter.post('/create-product',authMiddleware, createProduct); 
appRouter.get('/add-to-cart/:id',authMiddleware, AddtoCart); 

export default appRouter;