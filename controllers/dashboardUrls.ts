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
                    endDate = new Date(time);
                    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
                break;
            default:
                throw new Error("Invalid Time period or non provided")
        }
        
        const analytics = await prisma.analytics.findMany({
            where:{
                time: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        console.log(startDate,endDate,analytics)
        

        res.json(analytics);
    }catch(err:any){
        throw new Error(err);
    }
})



export {
    FetchAnalytics
}