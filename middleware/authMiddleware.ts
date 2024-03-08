import { Request, Response, NextFunction } from "express";
import { prisma } from "../Models/Users";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const authMiddleware = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(decoded);
        const user:any = await prisma.customer.findFirst({
            where:{id: decoded?.id}
        })
        // console.log("From middleware: "+user.name)
        req.user = user;
        next();
      }
    } catch (e:any) {
      console.log(e);
      throw new Error(e+' :Not Authorized');
    }
  } else {
    throw new Error("No token attached to request");
  }
});


// const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const { email } = req.user ;  // Assuming email is present in User model
//   const adminUser = await User.FindOne({ email });
//   if (!adminUser || adminUser.role !== "admin") {
//     throw new Error("You are not an Admin");
//   } else {
//     next();
//   }
// });

// export { authMiddleware, isAdmin };
