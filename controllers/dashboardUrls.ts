import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";


const FetchAnalytics = asyncHandler(async(req:any,res)=>{
    try{
        if(!req.user.isSeller) throw new Error("not a Seller");

        let {Time} = req?.query;

        const today = new Date();
const time = new Date(today);
let startDate: any;
let endDate: any;
console.log(time);

// Setting Time period
switch(String(Time)){
    case 'day':
        time.setHours(0, 0, 0, 0); // Set time to the start of the day
        startDate = new Date(time);
        endDate = new Date(time);
        endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
        break;
    case 'week':
        time.setDate(today.getDate() - 7); 
        startDate = new Date(time);
        startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
        break;
    case 'month':
        time.setDate(today.getDate() - 30); 
        startDate = new Date(time);
        startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
        break;
    default:
        throw new Error("Invalid Time period or none provided");
}
        
        let analytics:any = await prisma.analytics.findMany({
            where:{
                time: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        console.log(startDate,endDate,analytics)
        
        let PieChart = await FetchPieChart();
        

        console.log('data   :',{analytics,PieChart})
        res.json({analytics,PieChart});
    }catch(err:any){
        throw new Error(err);
    }
})

const FetchPieChart = async()=>{
    try{
        
        const topProducts = await prisma.product.findMany({
      take: 5, // Limit to top 5
      orderBy: {
        sold: 'desc' // Order by sales in descending order
      }
    });
    let data:any = [];
    const colors = ["hsl(9, 70%, 50%)","hsl(300, 70%, 50%)","hsl(40, 70%, 50%)","hsl(300, 70%, 50%)","hsl(8, 70%, 50%)"]
    topProducts.map( (product,idx) =>{
        data.push({
    "id": product.name+idx,
    "label": product.name,
    "value": product.sold,
    "color": colors[idx]
  })
    })

return data;

    }
    catch(err:any){
        throw new Error(err);
    }
}


const FetchInbox = asyncHandler(async(req:any,res)=>{
    try{
        if(!req.user.isSeller) throw new Error("not a Seller");
        
        let {page,status} = (req.query);
        if(status === 'all' ) status =''
        const orders = await prisma.order.findMany({
            where:{
                status: {
                    contains: String(status)
                }
            },
            skip: 6*Number(page-1),
            take: 6
        });
        
        res.json({orders})
    }
    catch(err:any){
        throw new Error(err);
    }
})


const FetchCustomerbyID = asyncHandler(async(req:any,res)=>{
    try{
        if(!req.user.isSeller) throw new Error("not a Seller");
        const customer = await prisma.customer.findUnique({
            where:{
                id: req.params.id
            },
           select:{
                email: true,
                name: true,
                address: true,
                profileuri: true,
            }
        });
        res.json({customer})
    }
    catch(err:any){
        throw new Error(err);
    }
})

const changeOrderStatus = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
         const ID = req.params.id;
         const {status} = req.query;
         console.log(ID,status);
         const order = await prisma.order.update({
            where:{
                order_id: String(ID)
            },
            data:{
                status: String(status)
            }
         });
         console.log(order);
         res.json(order)
    }
    catch(err:any){
        throw new Error(err);
    }
});

const fetchProdcuts = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
         const ID = req.params.id;
         const {page} = req.query;

         const products = await prisma.product.findMany({
            skip: 6*Number(page-1),
            take: 6,
            orderBy:{
                name: 'asc'
            }
         })
         let colors = [];
         for(let i of products){
            let color = await prisma.productColor.findMany({
                where:{
                    product_id: i.id
                }
            })
            colors.push(color)
         }
         console.log(products,colors);
         res.json({products,colors})
    }
    catch(err:any){
        throw new Error(err);
    }
});


const deleteProdcuts = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
         const ID = req.params.id;

         const products = await prisma.product.delete({
            where:{
                id: String(ID)
            }
         })
         
         res.json(products);
    }
    catch(err:any){
        throw new Error(err);
    }
});

const fetchCategory = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
         const ID = req.params.id;

         const category = await prisma.type.findFirst({
            where:{
                id: String(ID)
            }
         })
         
         res.json(category);
    }
    catch(err:any){
        throw new Error(err);
    }
});


const editProduct = asyncHandler(async(req:any,res)=>{
    if(!req.user.isSeller) throw new Error("not a Seller");
    try{
        if(!req.body.color || !req.body.URI || !req.body.count || !req.body.price) {throw new Error('try again ')}
         const ID = req.params.id;
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
         product=   await prisma.product.update({
            where:{
                id: String(ID)
            },
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
        await prisma.productColor.deleteMany({
            where:{
                product_id: String(ID)
            }
        })
        await prisma.productSpecs.deleteMany({
            where:{
                product_id: String(ID)
            }
        })
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


const fetchCustomers = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
        const {page} = req.query;
         const customers = await prisma.customer.findMany({
            skip: 6*Number(page-1),
            take: 6,
            select:{
                email: true,
                name: true,
                address: true,
                profileuri: true,
            }
         })
         console.log(customers)
         let notifications:any = await prisma.review.findMany({
            where:{
             dismiss: false,
             reply: null   
            }
         })
         console.log(customers, notifications)
         
         res.json({customers,notifications});
    }
    catch(err:any){
        throw new Error(err);
    }
});


const replyReview = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
        const reply= req.body.reply;
        const ID = req.params.id;
        const preview = await prisma.review.findFirst({
            where:{
                id: String(ID)
            }
        })
        if(!preview?.comment || String(reply) === ''){throw new Error("Error! Attempt to send Improper Reply!")}
        const review = await prisma.review.update({
            where:{
                id: String(ID),
            },
            data:{
                reply: String(reply),
                dismiss: true
            }
        })
         
         
         res.json(review);
    }
    catch(err:any){
        throw new Error(err);
    }
});

const dismissReview = asyncHandler(async(req:any,res)=>{
    try{
         if(!req.user.isSeller) throw new Error("not a Seller");
        const ID = req.params.id;
        const review = await prisma.review.update({
            where:{
                id: String(ID)
            },
            data:{
                dismiss: true
            }
        })
         
         
         res.json(review);
    }
    catch(err:any){
        throw new Error(err);
    }
});

export {
    FetchAnalytics,
    FetchInbox,
    FetchCustomerbyID,
    changeOrderStatus,
    fetchProdcuts,
    deleteProdcuts,
    fetchCategory,
    editProduct,
    fetchCustomers,
    replyReview,
    dismissReview
}