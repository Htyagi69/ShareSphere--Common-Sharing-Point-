import jwt from 'jsonwebtoken'
import User from '../model/auth.js'
import dotenv from 'dotenv'
dotenv.config()

export async function handleUserSignup(userInfo){
   const user=userInfo;
   const {firstname,lastname,email,password}=user;
   console.log(`name:${firstname+lastname},email${email},password${password}`);
   await User.create({
    firstname,
    lastname,
    email,
    password
   })
   const userDetail=await User.findOne({email,password});
//    console.log("SignUp user=>",userDetail);
   const token=await setUser(userDetail);
   return token;
}

export async function handleUserLogin(userInfo){
    const {email,password}=userInfo;
    const user=await User.findOne({email,password});
    // console.log("loggen in user=>",user);
    
    if(!user) {
        console.log('No such user')
        return null;
    }
    const token=await setUser(user)
    return token;
    // res.cookie('uid',token) 
}

const secret=process.env.JWT_SECRET;

export async function setUser(user){
    return jwt.sign({
        _id:user._id,
        email:user.email
    },secret,{ expiresIn: '24h' })
}

export async function getUser(token){
   if(!token) return null;
   try{
    return jwt.verify(token,secret);
   }catch(err){
    return null;
   }
}
