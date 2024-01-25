import bcrypt from "bcrypt";

const saltRounds = 13;

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    console.log(hash)
    return hash;
  } catch (err) {
    throw new Error("Can't hash password");
  }
};
export const  validateUser=async(hash:any,password:any)=>{
    return await bcrypt
      .compare(password, hash)
      .then(res => {
        return res // return true
      })
      .catch(err => {throw new Error("Can't hash password");})        
}
