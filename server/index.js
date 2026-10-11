import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import {handleUserSignup,handleUserLogin, setUser} from './Auth/auth.js'
import {upload, uploads,deleteFile,getsignedfileURL } from './services/s3Service.js';
import LoggedInUsersOnly from './Middleware/auth.js'
import { roomContextMiddleware,initDB } from './Middleware/roomContextMiddleware.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import GoogleStrategy from 'passport-google-oidc'
import {User,Room} from './model/auth.js';
import corsMiddleware from './Middleware/cors.js'
import { nanoid } from 'nanoid';
import { log } from 'console';

const app=express();
app.use(session({secret:process.env.passportSecret,resave:false,saveUninitialized:true}));
app.use(passport.initialize())
app.use(passport.session())

const PORT=process.env.PORT_NO||3000;

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(corsMiddleware)

app.use(express.json());
app.use(express.urlencoded({extended:'true'}))
app.use(cookieParser())

// async function download(url,name){
//     fs.writeFile(path.join(__dirname,"public",`${name}`),url,"utf-8",(err)=>{
//        if(err) console.error('Its not Online',err);
//        else{
//         console.log('Downloaded');
//        }
//     })
// }

app.post('/subscribed/rooms',LoggedInUsersOnly,async(req,res)=>{
    try{   
    const userMail=req.user.email
    console.log("email",userMail);
    
    const subscriber=await User.findOne({email:userMail}).populate({
      path:'subscribed_Rooms',
      select:"roomName roomSlug owner"
    })
    
    if (!subscriber) {
      return res.status(404).json({ message: 'User not found in database', lockers: [] });
    }
    const userRooms=subscriber.subscribed_Rooms || []
    console.log("dbs",userRooms);
    return res.status(200).json({"lockers":userRooms});
  }catch(error){
    console.error('Database error',error)
    return res.status(500).json({message:'Internal Server error'})
  }
})

app.post('/:roomName',LoggedInUsersOnly,async(req,res)=>{
    try{
    const roomName=req.params.roomName.toLowerCase();   
    const userId=req.user?._id.toString();
    
    const roomSlug=`${roomName}_${nanoid(4)}`.toLowerCase()
    const room=await Room.create({
      roomName:roomName,
      roomSlug:roomSlug,
      owner:userId,
      subscribers:[userId]
    })
    console.log("room",room);
    
    await initDB(roomSlug);
    await User.findByIdAndUpdate(
      userId,
      {$addToSet:{subscribed_Rooms:room._id}}
    )
    return res.status(200).json({"message":`${roomName} bucket created`,roomSlug});
  }catch(error){
    console.error('Database error',error)
    return res.status(500).json({message:'Internal Server error'})
  }
})

app.post('/:roomName/uploads',LoggedInUsersOnly,roomContextMiddleware,upload.single("file"),async(req,res)=>{
    const file=req.file;
    if (!file) {
  return res.status(400).json({ message: "No file uploaded" });
}

    console.log('file=',file); 
    try{
     await uploads(file);
    const urllink= await getsignedfileURL(`uploads/${file.originalname}`,'sharesphere-uploads-2026',3600);
     const meta={
      name:file.originalname,
      url:urllink,
      type:file.mimetype,
      key:`uploads/${file.originalname}`,
      createdAt:new Date().toISOString(),
       urlExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
     }
     console.log("db",req.db);
     
     await req.db.insert(meta);
    return res.json({
        name:file.originalname,
        mimeType:file.mimetype,
        size:file.size,
    })
}catch(err){
   console.error(err);
   return res.status(500).json({ message: "Upload failed" });
    }
})

app.post('/:roomName/deleteFile',LoggedInUsersOnly,roomContextMiddleware,async(req,res)=>{
    try{
      const {fileName}=req.body;
      if(!fileName) return res.status(400).json({ message: "fileName required" });
      await deleteFile(fileName)
      const  key=`uploads/${fileName}`
      const couchRes=await req.db.find({selector:{key:key}})
      if(couchRes.docs.length>0){
          const doc=couchRes.docs[0];
          await req.db.destroy(doc._id,doc._rev);
      }
      res.status(200).json({ message: "File deleted successfully" });
    }catch(err){
      console.error(err);
   return res.status(500).json({ message: "Deletion failed" });
    }
})

app.post('/auth/signup',async(req,res)=>{
  try{
   const user=req.body;
   const authData= await handleUserSignup(user);
     const token=authData.token;
   if(!token) return res.status(400).json({message:"SignUp failed"})
        res.cookie('uid',token,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        path:'/',
        maxAge:24*60*60*1000
      })
   res.status(200).json({
     userName:authData.name,
    message:"Signup Successful"
  })
  }catch (err) {
        res.status(500).json({ message: 'SignUp failed', error: err.message });
  }
  })
  
app.post('/auth/login',async(req,res)=>{
  try{
   const user=req.body;
   const authData= await handleUserLogin(user);
   const token=authData.token;
  if(!token) return res.status(400).json({message:"Invalid credentials"});
        res.cookie('uid',token,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        path:'/',
        maxAge:24*60*60*1000
      })
   res.status(200).json({
    userName:authData.name,
    message:'You are logged in'
  })
  }catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
  }
  })

  passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: [ 'profile' ]
  }, 
async (issuer, profile, done) => { // Google OIDC strategy provides 'issuer' first
  try {
    // Accessing email from the profile object
    const email = profile.emails[0].value;
    
    // Logic to find or create user in your DB
    let user = await User.findOne({ email }); 
    if (!user) {
      // Create user if they don't exist
      user = await User.create({ email, firstname: profile.displayName, lastname:'K',password:'GOOGLE_AUTH_PASSPORT_JS'});
    }
    console.log("issuer",issuer);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user));

app.get('/auth', passport.authenticate('google', { 
  scope: ['profile', 'email']
}))

app.get('/auth/google',passport.authenticate('google',{failureRedirect:'https://share-sphere-common-sharing-point.vercel.app/login'}),
async(req,res)=>{
  // this route contain whaever i pass to done() in the Googlestrategy
  const userToken=await setUser(req.user);
  res.cookie('uid',userToken,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        path:'/',
        maxAge:24*60*60*1000
  })
  res.redirect('https://share-sphere-common-sharing-point.vercel.app')
})


app.get('/auth/verify',LoggedInUsersOnly,(req,res)=>{
     res.status(200).json({
      authenticated:true,
      user:req.user
     })
})

app.post('/auth/logout',(req,res)=>{
    res.clearCookie('uid',{
      httpOnly:true,
        secure:true,
        sameSite:'None',
        path:'/',
    })
    return res.status(200).json({ message: "Logged out successfully" });
})

app.listen(PORT,()=>console.log(`server started at http://localhost:${PORT}`))
