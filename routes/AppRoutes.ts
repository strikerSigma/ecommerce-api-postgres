import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { SearchProducts, fetchCart, fetchProducts, fetchProductsById, fetchProductsCategory, fetchRatings, fetchWishlist } from '../controllers/fetchCtrl';
import { AddtoCart, AddtoWishlist, DeleteProduct, EditProfile, RemoveCartProduct, RemoveWishlistProduct, createProduct } from '../controllers/otherCtrl';
import { CheckOut, fetchOrders } from '../controllers/handlePayment';
import { Review } from '../controllers/userCtrl';



let appRouter = express.Router();

appRouter.get('/products', fetchProducts);
appRouter.get('/products-search', SearchProducts);
appRouter.get('/products-category', fetchProductsCategory);
appRouter.get('/cart',authMiddleware, fetchCart);
appRouter.get('/wishlist',authMiddleware, fetchWishlist);
appRouter.get('/products/:id', fetchProductsById);
appRouter.post('/create-product',authMiddleware, createProduct); 
appRouter.get('/add-to-cart/:id',authMiddleware, AddtoCart); 
appRouter.get('/add-to-wishlist/:id',authMiddleware, AddtoWishlist); 
appRouter.get('/get-orders',authMiddleware, fetchOrders); 
appRouter.post('/checkout',authMiddleware, CheckOut); 
appRouter.post('/review',authMiddleware, Review); 
appRouter.get('/fetch-ratings/:id', fetchRatings); 
// appRouter.post('/upload-image',authMiddleware,upload.single('image'), uploadImage); 
appRouter.delete('/delete-product/:id',authMiddleware, DeleteProduct); 
appRouter.delete('/remove-product-cart/:id',authMiddleware, RemoveCartProduct); 
appRouter.delete('/remove-product-wishlist/:id',authMiddleware, RemoveWishlistProduct); 
 

export default appRouter;