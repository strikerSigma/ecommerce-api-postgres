import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { generateJWT, refreshJWT } from '../config/jwtToken';  // Make sure to import your jwtToken functions
import { User } from "../Models/Users"; // Make sure to import your User model
// import sendMail from './email';  // Assuming sendMail is a TypeScript module


const createUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);
    const findUser = await User.FindOne(body);
    if (!findUser) {
        const newUser = await User.CreateOne(body);
        res.json(newUser);
    } else {
        throw new Error("User already Exists");
    }
});

// const loginUserCtrl = asyncHandler(async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     const user:any = await User.FindOne({ email, password });
//     const refreshToken = await refreshJWT(user?._id);
//     const updateUser = await User.findByIdAndUpdate(user?.id, { refreshToken }, { new: true });
//     res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

//     if (user) {
//         res.json({
//             _id: user._id,
//             name: user.Name,
//             email: user.email,
//             token: generateJWT(user._id)
//         });
//     } else {
//         throw new Error("An Error occurred with login");
//     }
// });

// const deleteUser = asyncHandler(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const deletedUser = await User.deleteOne({ _id: id });
//         if (deletedUser.deletedCount === 0) {
//             throw new Error("User does not exist");
//         }
//         res.json({ deletedUser, msg: "User deleted successfully!" });
//     } catch (err:any) {
//         throw new Error(err);
//     }
// });

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

// const logoutUser = asyncHandler(async (req: any, res: any) => {
//     const cookie = req.cookies;
//     if (!cookie?.refreshToken) {
//         throw new Error('Refresh token missing');
//     }
//     const refreshToken = cookie.refreshToken;
//     await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
//     res.clearCookie("refreshToken", { httpOnly: true, secure: true });
//     return res.sendStatus(204);
// });

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
    // loginUserCtrl,
    // deleteUser,
    // updateUser,
    // logoutUser,
    // resetPassword,
    // handleRefreshToken,
    // updatePassword
};
