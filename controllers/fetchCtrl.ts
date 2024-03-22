import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";
import { hashPassword, validateUser } from "../config/HasingPass";

const fetchProducts = asyncHandler(async(req,res)=>{
    try{
        
        let {page,category,price} = req?.query;
        
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
        skip:9*(Number(page)-1),
        take: 9, 
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

const SearchProducts = asyncHandler(async(req:any,res)=>{
    try{
        const search = req.query.search;
        const page = Number(req.query.page);
        const products = await prisma.product.findMany({
            where:{
                name:{
                    contains: String(search),
                    mode: 'insensitive'
                }
            },
            include:{
                type: true
            },
            skip:9*(Number(page)-1),
            take: 9, 
            orderBy: { id: 'asc' }, 
        })
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
        const products = await prisma.product.update({
        where:{
            id: String(id)
        },
        data:{
            views: { increment: 1 }
        }
        });

         const colors = await prisma.productColor.findMany({
                where: {
                    product_id: products?.id,
                }
            });
         const specs = await prisma.productSpecs.findMany({
                where: {
                    product_id: products?.id,
                }
            });
        console.log("request ",products,colors,specs)
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
    let cartToProduct = await prisma.cartToProduct.findMany({
        where: {
            cart_id: cart.cart_id
        },
        include:{
            Product: true
        }
    });
    for(let i in cartToProduct){
        const color:any = await prisma.productColor.findFirst({
            where:{
                product_id: cartToProduct[i].Product.id,
                color: String(cartToProduct[i].color)
            }
        });
        const specs:any = await prisma.productSpecs.findFirst({
            where:{
                product_id: cartToProduct[i].Product.id,
                specs: String(cartToProduct[i].specs)
            }
        }); 
        cartToProduct[i].color = color;
        cartToProduct[i].specs = specs;
    }
   
    console.log(cartToProduct);
    res.json({cart:cartToProduct})
    }
    catch (err:any) { throw new Error(err); }
});

const fetchWishlist = asyncHandler(async(req:any,res)=>{
    try{
        const wishlist = await prisma.wishlist.findMany({
            where:{
                customer_id: String(req.user.id)
            }
        })
        res.json({wishlist})
    }
    catch(e:any){throw new Error(e);}
})

const fetchRatings = asyncHandler(async(req:any,res)=>{
    try{
        const {id} = req.params;
        const ratings = await prisma.review.findMany({
            where:{
                productId: String(id)
            }
        });
        let customers =[] ;
        for(let i of ratings){
            customers.push(
                await prisma.customer.findFirst({
                where:{
                    id: String(i.customerId)
                },
                select:{
                    email: true,
                    name: true,
                    profileuri: true
                }
            })
            ) 
        }
       console.log(ratings,customers)

        res.json({ratings,customers})
    }
    catch(e:any){
        throw new Error(e)
    }
});
export {
    fetchProducts,
    fetchProductsCategory,
    fetchCart,
    fetchProductsById,
    fetchWishlist,
    SearchProducts,
    fetchRatings
}