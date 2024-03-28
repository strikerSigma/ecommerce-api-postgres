import { CronJob } from "cron";
import { prisma } from "../Models/Users";

export const job = new CronJob(
	'0 0 0 * * *', // cronTime
	async function () {
    
  try{
     
    console.log(await prisma.order.findMany())
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Subtract 1 day


        const startDate = new Date(yesterday);
        startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
        const endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

      // perform action for Root user/admin

       
       let sales = 0;
       let views = 0;
       let Revenue = 0;
       const products = await prisma.product.findMany();
       
       for(let product of products){
         views += product.views;
         sales += product.sold;
       }
       let orders:any = []
         const temp = await prisma.order.findMany({
          where:{
            time: {
            gte: startDate,
            lte: endDate
          }
          }
       })
        if(temp.length > 0){
          temp.filter((a,idx) =>{
          orders[idx]= a.order_id;
          //Calculate Revenue
          a.price.map((p,idx) =>{
            Revenue += Number(p*a.quantity[idx])
          })
        })
        }
         
       
       
       let pastAnalytics:any = await prisma.analytics.findFirst({
        where: {
          time: {
            gte: startDate,
            lte: endDate
          }
        }
       });
       console.log(pastAnalytics,startDate,endDate,temp)
       if(!pastAnalytics){ pastAnalytics = {
          sales: 0,
          views:0,
          Revenue: 0
       }; }
       sales = sales-pastAnalytics.sales;
       views = views-pastAnalytics.views;
       Revenue = Revenue-pastAnalytics.Revenue;
       if(sales < 0) sales =0;
       if(views < 0) views =0;
       if(Revenue < 0) Revenue =0;
      const analytics =   await prisma.analytics.create({
          data:{
            sales,
            orders,
            views,
            Revenue,
          }
        })
        
      
		console.log('Logs updated ',analytics);
  }
  catch(e:any){
    console.log(e);
  }
	}, // onTick
	null, // onComplete
	true
);