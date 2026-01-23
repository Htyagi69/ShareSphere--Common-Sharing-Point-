import {getUser} from '../Auth/auth.js'

async function LoggedInUsersOnly(req,res,next){
       const UserId=req.cookies?.uid;
       console.log("Raw Cookie Header:", req.headers.cookie); 
       console.log("Parsed Cookies:", req.cookies);
       if(!UserId){
           console.log('Cookie not found');
           return res.status(401).json({ message: "Please login again" });
       }
       const user=await getUser(UserId);
       if(!user){
         console.log('No such user');
         return res.status(401).json({ message: "Invalid user" });
       }
       req.user=user;
       next();
}

export default LoggedInUsersOnly