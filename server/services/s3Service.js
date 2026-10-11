import { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const s3=new S3Client({
    region:process.env.AWS_REGION
})

export const upload=multer({storage:multer.memoryStorage()})

export const uploads=async(file)=>{
    console.log('filedata====',file);
    
    const command=new PutObjectCommand({
       Bucket:process.env.S3_BUCKET_NAME,
       Key: `uploads/${file.originalname}`,
       Body: file.buffer,
       ContentType: file.mimetype,
       ServerSideEncryption: "aws:kms",
    })
   const result=await s3.send(command)
     console.log("File uploaded");
     return result;
}

 export  const deleteFile=async(fileName)=>{
      const command=new DeleteObjectCommand({
        Bucket:process.env.S3_BUCKET_NAME,
        Key: `uploads/${fileName}`,
  })
  const result=await s3.send(command);
  console.log('Deleted',fileName);
  return result;
}

export  async function getsignedfileURL(filename,bucketname,expiresIn){
    const command = new GetObjectCommand({
    Bucket: bucketname,
    Key: filename,
  });
    return await getSignedUrl(s3, command, { expiresIn });
    }