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
   return {message:"User is created"}
}

export async function handleUserLogin(userInfo){
    const {email,password}=userInfo;
    const user=await User.findOne({email,password});
    if(!user) console.log('No such user')
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

// export default {
//     handleUserLogin,
//     handleUserSignup,
//     getUser
// }

// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv'
// dotenv.config()

// const verifytoken=(req,res,next)=>{
//     const authtoken=req.headers['authorization']
//     const token=authtoken && authtoken.split(' ')[1]
//     if(!token) res.status(403).send('A token is required');
     
//     try{
//         const decoded=jwt.verify(token,process.env.JWT_SECRET);
//         req.user=decoded;
//         next();
//     }catch(err){
//         return res.status(401).send("Invalid Token");
//     }
// }
// export default verifytoken