import express from 'express'
import { S3Client,PutObjectCommand,GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs'
import multer from 'multer';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import  nanoLib from 'nano'
import { url } from 'inspector';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();
const PORT=3000;

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const user=process.env.DB_user
const pass=process.env.password

const connectedURL=process.env.COUCH_URL||`http://${user}:${pass}@127.0.0.1:5984`;
// const connectedURL=`http://${user}:${pass}@127.0.0.1:5984`;

const nano=nanoLib(connectedURL)
const db=nano.db.use('share-point')

//couchdb initialize
const init=async ()=>{
  try{
    const dblist=await nano.db.list();
    if(!dblist.includes('share-point')){
      await nano.db.create('share-point')
      console.log('share-point is created');
    }  
    }catch(err){
       console.error('Check if CouchDB is running!', err.message);
    }
  }

  init();

app.use(cors({
    origin:["https://share-sphere-common-sharing-point.vercel.app",
            "http://localhost:5173" ,
            "https://share-sphere-common-sharing-point-git-main-harshiis-projects.vercel.app",
            "https://share-sphere-common-sharing-point-cv5l1fqn3-harshiis-projects.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:'true'}))

const s3=new S3Client({
    region:process.env.AWS_REGION
})

const upload=multer({storage:multer.memoryStorage()})

const uploads=async(file)=>{
    console.log('filedata====',file);
    
    const command=new PutObjectCommand({
       Bucket:process.env.S3_BUCKET_NAME,
       Key: `uploads/${file.originalname}`,
       Body: file.buffer, // ✅ CORRECT
       ContentType: file.mimetype,
       ServerSideEncryption: "aws:kms",
    })

   const result=await s3.send(command)
     console.log("File uploaded");
     return result;
}

  async function getsignedfileURL(filename,bucketname,expiresIn){
    const command = new GetObjectCommand({
    Bucket: bucketname,
    Key: filename,
  });

  // await the signed URL and return it
  return await getSignedUrl(s3, command, { expiresIn });
  }
// async function download(url,name){
//     fs.writeFile(path.join(__dirname,"public",`${name}`),url,"utf-8",(err)=>{
//        if(err) console.error('Its not Online',err);
//        else{
//         console.log('Downloaded');
//        }
//     })
// }

app.get('/',async(req,res)=>{
  try{
    const list=await db.list({include_docs:true});
    // CouchDB returns docs in rows[].doc format
      const urls=list.rows.map(item=>item.doc.url);
    return res.json({url:urls});
  }catch(error){
    console.error('Database error',error)
    return res.status(500).json({message:'Internal Server error'})
  }
})

app.post('/uploads',upload.single("file"),async(req,res)=>{
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
      createdAt:new Date().toISOString()
     }
     await db.insert(meta);
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

app.listen(PORT,()=>console.log(`server started at http://localhost:${PORT}`))
