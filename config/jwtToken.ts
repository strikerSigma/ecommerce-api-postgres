import jwt from 'jsonwebtoken';


export const refreshJWT = (id:string)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment.');
    }
    var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(process.env.JWT_SECRET)
    return token;
}


export const generateJWT = (id:string)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment.');
    }
    var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return token;
}
