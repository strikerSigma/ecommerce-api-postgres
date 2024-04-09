import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { generateJWT, refreshJWT } from '../config/jwtToken';  // Make sure to import your jwtToken functions
import { prisma } from "../Models/Users";
import { hashPassword, validateUser } from "../config/HasingPass";
// import sendMail from './email';  // Assuming sendMail is a TypeScript module


const createUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const hash = await hashPassword(body.password)
        try{
            const user = await prisma.customer.create({
             data: {
                name: body.name,
                email: body.email,
                password: hash,
                address: body.address,
                isSeller: false,
        },
            });
            console.log(user);
        const refreshToken = await refreshJWT(user?.id);
         await prisma.customer.update({
            where: {
                id: user.id,
            },
            data:{
                token: refreshToken
            }
        }) 
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: refreshToken
                });
        }
        catch (err:any) { throw new Error(err);}
});

const loginUserCtrl = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try{
        console.log(email);
            const user:any = await prisma.customer.findFirst({
             where: {
                email},
            });
            const refreshToken = await refreshJWT(user?.id);           
            const unhased:any = await validateUser(user.password,password);
            if(unhased){
                await prisma.customer.update({
                where:{
                    email: email
                },
                data: {
                    token: refreshToken
                }
            })
            res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    isSeller: user.isSeller,
                    token: generateJWT(user.id)
                });
            }
            else {throw new Error("Password incorrect");}
                
        }
        catch (err:any) { throw new Error(err);}
});
//implement Email later for better user verification
const deleteUser = asyncHandler(async (req: any, res: Response) => {
    const  id:any  = req.params.id;

    const idNum:number = Number(id)
    try {
        const deletedUser = await prisma.customer.delete({
            where:{email: req.user.email}
        })
        res.json({ name:deletedUser.name, msg: "User deleted successfully!" });
    } catch (err:any) {
        throw new Error(err);
    }
});

const verifyUser = asyncHandler( async(req:any,res)=>{
    try{
        
        res.json({
            Role: req.user.isSeller
        })
    }
    catch(err:any){throw new Error(err);}
})


const logoutUser = asyncHandler(async (req: any, res: any) => {


    try{
            await prisma.customer.update({
                where:{
                    email: req.user.email
                },
                data: {
                    token: ""
                }})
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
     res.json({msg: "User logged out"})
    }
    catch (err:any) { throw new Error(err) }

});

const Review = asyncHandler(async (req: any, res: any) => {

    try{
            
            const {product_id, order_id, comment, review } = req.body;
            
            const order = await prisma.order.findFirst({
                where:{
                    order_id: String(order_id),
                    product_id: {
                        hasSome: [String(product_id)]
                    },
                    customer_id: String(req.user.id)
                }
            })
            if(!order) {throw new Error('User not Authorized for the review!');}
            if(order.status !== 'delivered') {throw new Error('Product not recieved yet!');}
            const product = await prisma.product.findFirst({
                where:{
                    id: String(product_id)
                }
            })
            const ExistRating = await prisma.review.findFirst({
                where:{
                    id: String(product_id)+String(order_id),
                }
            })

            if(ExistRating) {throw new Error('the user has already rated this product!');}
            const rating  = await prisma.review.create({
                data:{
                    id: String(product_id)+String(order_id),
                    productId: String(product_id),
                    customerId: String(req.user.id),
                    sellerId: String(product?.customerId),
                    comment: String(comment),
                    review: Number(review),
                }
            })

     res.json(rating)
    }
    catch (err:any) { throw new Error(err) }

});

// const updatePassword = asyncHandler(async (req: Request, res: Response) => {
//     const { email } = req.body;
//     const user:any = await User.FindOne({ email: email });
//     if (!user) {
//         throw new Error(`User with email: ${email} does not exist`);
//     }
//     const secret = process.env.JWT_PASSWORD_RESET + user._id;
//     const payload = { email, id: user._id };
//     const token = jwt.sign(payload, secret, { expiresIn: '30m' });
//     await User.FindByIdAndUpdate({ _id: user._id }, {
//         passwordResetToken: token,
//         JWTsecret: secret
//     });
//     const subject = "Your token, do not share it with others, validity: 30m";
//     sendMail(email, subject, token).then((result:any) => console.log(result)).catch((err:any) => { throw new Error(err) });

//     res.json({ message: "Token has been sent to your email" });
// });

const userRecommendation = asyncHandler(async(req:any,res)=>{
    try{
        
        const products = await prisma.product.findMany({
            take: 8
        });

         const colorsPromises = products.map(async (product) => {
            return await prisma.productColor.findFirst({
                where: {
                    product_id: product.id,
                }
            });
        });

        const colors = await Promise.all(colorsPromises);

        res.json({products,colors})
    }
    catch (err:any) { throw new Error(err) }
})

export {
    createUser,
    loginUserCtrl,
    deleteUser,
    // updateUser,
    logoutUser,
    verifyUser,
    Review,
    // resetPassword,
    // handleRefreshToken,
    userRecommendation
};
