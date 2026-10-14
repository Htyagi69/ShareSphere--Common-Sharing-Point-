import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
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
   },
   profileImage: {
        type: String,
        default: 'https://github.com/shadcn.png'
    },
   subscribed_Rooms:[{
      type:mongoose.Schema.ObjectId,
      ref:'Room',
      default:[]
   }]
})

const roomsSchema=new mongoose.Schema({
   roomName:{
      type:String,
      required:true
   },
   roomSlug:{
      type:String,
      required:true,
      unique:true
   },
   owner:{
      type:mongoose.Schema.ObjectId,
      ref:'User'
   },
   subscribers:[{
      type:mongoose.Schema.ObjectId,
      ref:'User'
   }],
   inviteToken:{type:String,default:null},
   inviteExpiresAt:{type:Date,default:null}
})

export const User=mongoose.model('User',urlSchema);
export const Room=mongoose.model('Room',roomsSchema);
