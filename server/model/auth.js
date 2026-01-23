import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.Mongo_URL||'mongodb://127.0.0.1:27017/SharepointUsers')
.then(()=>console.log('Mongodb is connected'))

const urlSchema=new mongoose.Schema({
   firstname:{
    type:String,
    required:true,
   },
   lastname:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
   },
   password:{
    type:String,
    required:true,
   }
})

const User=mongoose.model('users',urlSchema);

export default User