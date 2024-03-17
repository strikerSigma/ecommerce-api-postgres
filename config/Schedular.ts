import { CronJob } from "cron";
import { prisma } from "../Models/Users";

export const job = new CronJob(
	'0 0 0 * * *', // cronTime
	async function () {
    
  try{
        const customers = await prisma.customer.findMany({
        where:{
          isSeller: true
        }
      });
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set time to the start of the day
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

      // perform action for each customer 

     for(const customer of customers) {
       const products = await prisma.product.findMany({
        where:{
          customerId: customer.id
        }
       })
       
       let sales = 0;
       let views = 0;
       let orders:any = []
       for(const a of products){
         views += a.views;
         sales += a.sold;
         const temp = await prisma.order.findMany({
          where:{
            product_id: {
               hasEvery: [a.id]
            }
          }
       })
        if(temp.length > 0){
          temp.filter(a =>{
          return a.order_id
        })
         orders = orders.concat(temp.map(a => a.order_id))
        }
         
       }
       
       let pastAnalytics:any = await prisma.analytics.findFirst({
        where: {
          customerId: customer.id,
          time: {
            gte: startDate,
            lte: endDate
          }
        }
       });
       if(!pastAnalytics){ pastAnalytics = {
          sales: 0,
          views:0,
       }; }
        await prisma.analytics.create({
          data:{
            customerId: customer.id,
            sales: Math.abs(sales-pastAnalytics.sales),
            orders: orders,
            views: Math.abs(views-pastAnalytics.views)
          }
        })
        
      }
		console.log('Logs updated ');
  }
  catch(e:any){
    console.log(e);
  }
	}, // onTick
	null, // onComplete
	true
);