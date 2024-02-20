import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";
import { hashPassword, validateUser } from "../config/HasingPass";

const createProduct = asyncHandler(async(req:any,res)=>{
    if(!req.user.isSeller) throw new Error("not a Seller");
    try{
        let type = await prisma.type.findFirst({
            where:{
                name: {
                    contains: req.body.category,
                    mode: 'insensitive'
                },
            }
        })
        if(!type){
            type = await prisma.type.create({
            data:{
                name: req.body.category
            }
        });
        }
        const price = String(req.body.price).split('|');
        let product:any;
         product=   await prisma.product.create({
            data:{
                name: req.body.name,
                price: Number(price[0]),
                desc: req.body.desc,
                typeId: type.id,
                customerId: req.user.id
            }
        })
        console.log(product);
        const color = String(req.body.color).split('|');
        const URI = String(req.body.URI).split('|');
        const count =  String(req.body.count).split('|');
        console.log(color,count,URI);
         for(let i in color){
            await prisma.productColor.create({
            data:{
                product_id: product.id,
                color: color[i],
                item_count: Number(count[i]),
                imageuri: URI[i],
            }
        })
         }
    if(req.body.specs){
    const specs = String(req.body.specs).split('|');
    for(let i in specs){
        await prisma.productSpecs.create({
            data:{
                product_id: product.id,
                specs: specs[i],
                price: Number(price[i])
            }
        })
    }  
    }
        res.json({product})
    }
    catch(err:any){throw new Error(err);}
});


const AddtoCart = asyncHandler(async(req:any,res)=>{
    
    try{
        const {id} = req.params;
        const count = Number(req.query.count);
        let cart = await prisma.cart.findFirst({
            where:{
                customer_id: req.user.id,
            }
        });
        if(!cart){
            cart = await prisma.cart.create({
                data:{
                    customer_id: req.user.id,
                }
            })
        }
        const cartToProduct = await prisma.cartToProduct.create({
            data:{
                cart_id: cart.cart_id,
                product_id: String(id),
                itemcount: count? count: 1,
            }
        })
        res.json({cartToProduct});
    }
    catch(err:any){throw new Error(err)}
    
})

export {
    createProduct,
    AddtoCart
}