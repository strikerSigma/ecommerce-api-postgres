import jwt from 'jsonwebtoken';


export const refreshJWT = (id:string)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment.');
    }
    try{
        var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '2d' });
    return token;
    }
    catch(e:any){
        throw new Error('Could not parse token')
    }
}


export const generateJWT = (id:string)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment.');
    }
    try{
        var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '2d' });
    
    return token;
    }
    catch(e:any){
         throw new Error('Could not generate token')
    }
}
