import jwt from 'jsonwebtoken'
import User from '../model/auth.js'
import dotenv from 'dotenv'
dotenv.config()

const capitalize = (word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
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
   const userName=capitalize(firstname)+" " +capitalize(lastname);
   return {name:userName,token:token};
}

export async function handleUserLogin(userInfo){
    const {email,password}=userInfo;
    const user=await User.findOne({email,password});
    // console.log("loggen in user=>",user);
    
    if(!user) {
        console.log('No such user')
        return null;
    }
    const userName=capitalize(user.firstname)+" " +capitalize(user.lastname);
    console.log("user",userName);
    const token=await setUser(user)
    return {name:userName,token:token};
    // res.cookie('uid',token) 
}

const secret=process.env.JWT_SECRET;

export async function setUser(user){
    return jwt.sign({
        _id:user._id,
        email:user.email,
        name:capitalize(user.firstname)+" " +capitalize(user.lastname),
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
