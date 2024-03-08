import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";
import Stripe from 'stripe';


const stripe = new Stripe(String(process.env.STRIPE_KEY));

const CheckOut = asyncHandler(async(req:any,res)=>{
    try{
        // console.log(req.body.items);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map((item:any) => {
                return {
                    quantity: Number(item.count),
                    price_data: {
                        currency: 'usd',
                        product_data:{
                            name: item.order.Product.name
                        },
                        unit_amount: Number(item.order.specs.price)*100
                    }
                }
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/failure`
        });
        
         await prisma.order.create({
            data:{
                customer_id: String(req.user.id),
                order_id: session.id,
                product_id: req.body.items.map((item:any)=> {
                   return item = String(item.order.Product.id)
                }),
                quantity : req.body.items.map((item:any)=> {
                    return item = Number(item.count)
                }),
                price : req.body.items.map((item:any)=> {
                    return item = Number(item.order.specs.price)
                }),
                address: req.user.address
            }
        })
        
        console.log(session);
        res.json({url: session.url})
    }
    catch(e:any){
        throw new Error(e);
    }
});

const fetchOrders = asyncHandler(async(req:any,res)=>{
    try{
        const orders = await prisma.order.findMany({
            where:{
                customer_id: String(req.user.id)
            }
        });
        res.json(orders);
    }
    catch(e:any){
        throw new Error(e)
    }
})

export {
    CheckOut,
    fetchOrders
}