import nanoLib from 'nano'
import dotenv from 'dotenv';
import { Room } from '../model/auth.js';
dotenv.config();
const user=process.env.DB_user
const pass=process.env.password

const connectedURL=process.env.COUCH_URL||`http://${user}:${pass}@127.0.0.1:5984`;

const nano=nanoLib(connectedURL)

//couchdb initialize
export const initDB=async (roomName)=>{
  try{
    const dblist=await nano.db.list();
    // console.log("dblist",dblist);
    
    if(!dblist.includes(`share-point_${roomName}`)){
      await nano.db.create(`share-point_${roomName}`)
      console.log(`share-point_${roomName} is created`);
    }  
   }catch(err){
    console.error('Check if CouchDB is running!', err.message);
}
  return nano.db.use(`share-point_${roomName}`)
  }

export const roomContextMiddleware=async(req,res,next)=>{
    const roomIdentifier=req.params.roomName;
    const userId=req.user?._id.toString();
    if(!roomIdentifier)
         return res.status(400).json({ message: 'Room name is required in the request' });
   if(!userId) return res.status(401).json({ message: 'Unauthorized: User session missing' });
    try{
      const room=await Room.findOne({
        roomSlug:roomIdentifier.toLowerCase()
      })
      if (!room) {
            return res.status(404).json({ message: 'Locker not found' });
        }
      const isOwner=room.owner &&  room.owner.equals(userId);
      const isSubscriber=room.subscribers && room.subscribers.some(subId=>subId.equals(userId))
      if (!isOwner && !isSubscriber) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to access this locker' });
        }
        const roomDB=await initDB(room.roomSlug)
        req.db=roomDB;
        req.room=room
        next()
    }catch (error) {
        console.error('Room DB middleware error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
