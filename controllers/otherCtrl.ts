import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";


const createProduct = asyncHandler(async(req:any,res)=>{
    if(!req.user.isSeller) throw new Error("not a Seller");
    try{
        if(!req.body.color || !req.body.URI || !req.body.count || !req.body.price) {throw new Error('try again ')}
        const color = String(req.body.color).split('|');
        const URI = String(req.body.URI).split('|');
        const count =  String(req.body.count).split('|');
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


const AddtoCart = asyncHandler(async(req:any,res:any)=>{
    
    try{
        const {id} = req.params;
        const count = Number(req.query.count);
        const color = String(req.query.color);
        const specs = String(req.query.specs);

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
                specs,
                color
                
            }
        })
        console.log(cartToProduct)
        res.json({cartToProduct});
    }
    catch(err:any){throw new Error(err)}
    
})

const EditProfile = asyncHandler(async(req:any,res)=>{
    try{
        
        const user:any = await prisma.customer.update({
            where:{
                id: req.user.id
            },
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email
            }
        });
        console.log("updated")
        res.json({
            name: user.name,
            address: user.address,
            email: user.email
        })
    }
    catch(err:any){throw new Error(err)}
})


const DeleteProduct = asyncHandler(async(req:any,res)=>{
    const ID = String(req.params.id);
    try{
       const product = await prisma.product.delete({
        where:{
            id: ID
        }
       })
        res.json({
            product
        })
    }
    catch(err:any){throw new Error(err)}
})

const RemoveCartProduct = asyncHandler(async(req:any,res)=>{
    try{
        const ID = String(req.params.id);
        const cart:any = await prisma.cart.findFirst({
            where:{
                customer_id: String(req.user.id)
            }
        });
        console.log(cart);
        const cartToProduct = await prisma.cartToProduct.delete({
            where:{
                cart_id_product_id: {
                    cart_id: cart.cart_id,
                    product_id: ID
                }  
            }
        })
        res.json({cartToProduct})
    }
    catch(e:any){
        throw new Error(e);
    }
});

const RemoveWishlistProduct = asyncHandler(async(req:any,res)=>{
    try{
        const ID = String(req.params.id);
        const wishlist = await prisma.wishlist.delete({
            where:{
                 customer_id_product_id:{
                    customer_id: String(req.user.id),
                    product_id:ID
                 }
            }
        })
        res.json({wishlist})
    }
    catch(e:any){
        throw new Error(e);
    }
});
const AddtoWishlist = asyncHandler(async(req:any,res)=>{
    try{
        const ID = String(req.params.id);
        const wishlist:any = await prisma.wishlist.create({
            data:{
                customer_id: String(req.user.id),
                product_id: ID
            }
        });
        
        res.json({wishlist})
    }
    catch(e:any){
        throw new Error(e);
    }
});




export {
    createProduct,
    AddtoCart,
    EditProfile,
    AddtoWishlist,
    DeleteProduct,
    RemoveCartProduct,
    RemoveWishlistProduct,
}