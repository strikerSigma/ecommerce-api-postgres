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
                isSeller: body.isSeller? true : false,
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

// const updateUser = asyncHandler(async (req: any, res: Response) => {
//     const { id } = req.user;
//     try {
//         const updatedUser = await User.findByIdAndUpdate({ _id: id }, {
//             firstName: req?.user?.firstName,
//             lastName: req?.user?.lastName,
//             email: req?.user?.email,
//             mobile: req?.user?.mobile,
//             password: req?.user?.password
//         });
//         if (!updatedUser) {
//             throw new Error("User does not exist");
//         }
//         res.json({ msg: "User updated successfully!" });
//     } catch (err:any) {
//         throw new Error(err);
//     }
// });

const logoutUser = asyncHandler(async (req: any, res: any) => {
    const cookie = req.cookies;
    console.log(cookie?.refreshToken)
    if (!cookie?.refreshToken) {
        throw new Error('Refresh token missing');
    }
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

// const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
//     const cookie = req.cookies;
//     if (!cookie?.refreshToken) {
//         throw new Error('Refresh token missing');
//     }
//     const refreshToken = cookie.refreshToken;
//     const user:any = await User.FindOne({ refreshToken });
//     if(! process.env.JWT_SECRET) throw new Error('JWT key not available')
//     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
//     if (!user) {
//         throw new Error('Express token expired');
//     }
//     const newToken = refreshJWT(user?._id);
//     res.json({ newToken });
// });

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

// const resetPassword = asyncHandler(async (req: Request, res: Response) => {
//     const { email, token, password } = req.body;
//     const user:any = await User.FindOne({ email });
//     const decodedToken = jwt.verify(token, user.JWTsecret);
//     if (!decodedToken) {
//         throw new Error('Invalid token');
//     }
//     const updatedUser = await User.updateOne({ email }, {
//         password,
//         passwordResetToken: null,
//         JWTsecret: null
//     });
//     res.json({ message: "Password has been successfully updated" });
// });

export {
    createUser,
    loginUserCtrl,
    deleteUser,
    // updateUser,
    logoutUser,
    // resetPassword,
    // handleRefreshToken,
    // updatePassword
};
