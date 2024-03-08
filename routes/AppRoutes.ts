import express from 'express';

import {authMiddleware} from  '../middleware/authMiddleware';
import { SearchProducts, fetchCart, fetchProducts, fetchProductsById, fetchProductsCategory, fetchWishlist } from '../controllers/fetchCtrl';
import { AddtoCart, AddtoWishlist, DeleteProduct, EditProfile, RemoveCartProduct, RemoveWishlistProduct, createProduct, uploadImage } from '../controllers/otherCtrl';
import { CheckOut, fetchOrders } from '../controllers/handlePayment';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))
    }
});

export const upload =  multer({
    storage
})

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
appRouter.post('/upload-image',authMiddleware,upload.single('image'), uploadImage); 
appRouter.delete('/delete-product/:id',authMiddleware, DeleteProduct); 
appRouter.delete('/remove-product-cart/:id',authMiddleware, RemoveCartProduct); 
appRouter.delete('/remove-product-wishlist/:id',authMiddleware, RemoveWishlistProduct); 
 

export default appRouter;