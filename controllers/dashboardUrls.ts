import asyncHandler from 'express-async-handler';  
import { prisma } from "../Models/Users";


const FetchAnalytics = asyncHandler(async(req:any,res)=>{
    try{
        if(!req.user.isSeller) throw new Error("not a Seller");

        let {Time} = req?.query;

        const today = new Date();
        const time = new Date(today);
        let startDate:any;
        let endDate:any;
        // Setting Time period
        switch(String(Time)){
            case 'day':
                time.setDate(today.getDate()); 
                 startDate = new Date(time);
                    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
                    endDate = new Date(time);
                    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
                break;
            case 'week':
                time.setDate(today.getDate()-7); 
                 startDate = new Date(time);
                    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
                    time.setDate(today.getDate()); 
                    endDate = new Date(time);
                    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
                break;
            case'month':
                time.setDate(today.getDate()-30); 
                 startDate = new Date(time);
                    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
                    time.setDate(today.getDate()); 
                     endDate = new Date(new Date()); 
                    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
                break;
            default:
                throw new Error("Invalid Time period or non provided")
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

export {
    FetchAnalytics,
    FetchInbox,
    FetchCustomerbyID,
    changeOrderStatus
}