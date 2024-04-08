import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from './middleware/errorHandler';
import authRouter from "./routes/authRoutes";
import appRouter from "./routes/AppRoutes";
import cors from 'cors';
import { CronJob } from 'cron';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from "./middleware/authMiddleware";
import { prisma } from "./Models/Users";
import { job } from "./config/Schedular";
import adminRouter from "./routes/AdminRoutes";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user',authRouter)
app.use('/admin',adminRouter)
app.use('/app',appRouter)
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/profile', express.static(path.join(__dirname, 'public/Profile')));
// multer for file upload to disk
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'public/images'))
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname+'_'+Date.now()+path.extname(file.originalname))
    }
});

const upload =  multer({
    storage
})

app.get("/", (req: Request, res: Response) => {
  console.log(process.env.JWT_SECRET);
    res.json("Express + TypeScript Server");
});

app.post("/upload-image",authMiddleware, upload.single('image'), (req: Request, res: Response) => {
  try{
    console.log(req.file);
    res.json(req.file?.filename);
  }
  catch(e:any){
    console.log(e);
    throw new Error(e);
  }
});


job.start();
app.use(notFound);
app.use(errorHandler)

app.listen(process.env.PORT || port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
