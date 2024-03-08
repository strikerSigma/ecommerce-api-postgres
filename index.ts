
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from './middleware/errorHandler';
import authRouter from "./routes/authRoutes";
import appRouter from "./routes/AppRoutes";
import cors from 'cors';
import multer from 'multer';
import path from 'path';


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
app.use('/app',appRouter)


app.get("/", (req: Request, res: Response) => {
  console.log(process.env.JWT_SECRET);
    res.json("Express + TypeScript Server");
});
app.get("/test", (req: Request, res: Response) => {
  console.log("up and running");
    res.json("Express + TypeScript Server");
});
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))
    }
});

export const upload =  multer({
    storage
})
app.use(notFound);
app.use(errorHandler)



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
