import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";
import { hashPassword, validateUser } from "../config/HasingPass";

const fetchProducts = asyncHandler(async(req,res)=>{
    try{
        
        let {search,page,category,price} = req?.query;
        
        let minprice=0;
        let priceRange;
        if(!price){priceRange = 0}else{priceRange=Number(price);}
        switch(priceRange){
            case 0:
                priceRange = 100000;break;
            case 300:
                minprice =100;break;
            case 1000:
                minprice =300;break;
            case 2000:
                minprice =1000;priceRange = 100000;break;
        }

        const products = await prisma.product.findMany({
        where:{
            name: {
                    contains: String(search) ,
                    mode: 'insensitive',
            },
            price: {
            gte: minprice,  // Minimum price
            lte: priceRange, // Maximum price
            },
            type: {
                name:{
                    contains: String(category) ,
                    mode: 'insensitive',
                }
            }
        
        },
        include: {
            type: true
        },
        skip:21*(Number(page)-1),
        take: 21, 
        orderBy: { id: 'asc' }, 
        });
        console.log(products)
        const colorsPromises = products.map(async (product) => {
            return await prisma.productColor.findFirst({
                where: {
                    product_id: product.id,
                }
            });
        });

        const colors = await Promise.all(colorsPromises);
        res.json({products,colors});
    }
    catch(err:any){ throw new Error(err); }
})

const fetchProductsCategory = asyncHandler(async(req,res)=>{
    try{
        const {category,page} = req?.query;
        const type = await prisma.type.findFirst({
            where:{
                name: {
                    contains: String(category),
                    mode: 'insensitive'
                },
                
            }
        })
        const products = await prisma.product.findMany({
        where:{
            typeId: type?.id
        }, 
        skip:21*(Number(page)-1),
        take: 21, 
        orderBy: { id: 'asc' }, 
        });
        res.json({products});
    }
    catch(err:any){ throw new Error(err); }
})

const fetchProductsById = asyncHandler(async(req,res)=>{
    try{
        const {id} = req?.params;
        const products = await prisma.product.findFirst({
        where:{
            id: String(id)
        },
        });

         const colors = await prisma.productColor.findMany({
                where: {
                    product_id: products?.id,
                }
            });
            console.log(colors);
         const specs = await prisma.productSpecs.findMany({
                where: {
                    product_id: products?.id,
                }
            });
            
        res.json({products,colors,specs});
    }
    catch(err:any){ throw new Error(err); }
})

const fetchCart = asyncHandler(async(req:any,res)=>{
    try{
        let cart = await prisma.cart.findFirst({
        where: {
            customer_id: req.user.id,
        }
    })
    if(!cart){
    cart = await prisma.cart.create({
        data: {
            customer_id: req.user.id,
        }
    })
    }
    res.json({cart})
    }
    catch (err:any) { throw new Error(err); }
})
export {
    fetchProducts,
    fetchProductsCategory,
    fetchCart,
    fetchProductsById
}