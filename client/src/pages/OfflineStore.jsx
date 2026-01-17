import React , { useEffect, useState } from 'react'
import PouchDb from 'pouchdb';
const db=new PouchDb('downloaded_files')

const FILE_CACHE_NAME='ShareSphere-file-storage';
export async function save(s3url,filename,filetype){
try{
 const cache=await caches.open(FILE_CACHE_NAME)
 const result=await fetch(s3url)
 if(!result.ok) throw new Error('"Network response was not ok"');
     await cache.put(filename,result);
     console.log(`${filename} is now saved for offline use!`)
     const uri=await offlineFilesUrl(filename,filetype)
     let newDoc = {
          _id:filename,
          filename:filename,
          type:filetype,
          downloadedAt: new Date().toISOString()
     }
     try{
     await db.put(newDoc)
     console.log('BrowserUrl is===',uri);
    }catch(err){
        if(err.status===409){
            const existingDoc=await db.get(filename);
            db.put({
                ...newDoc,
                _rev:existingDoc._rev,
            })
            console.log('PouchDB updated successfully:', newDoc);
        }else {
        throw err; // It was a different error, re-throw it
      }
    }
    }catch(err){
        console.error('Download failed:', err)
    }
} 

async function offlineFilesUrl(filename,fileType){
   const cache= await caches.open('ShareSphere-file-storage');
   const matchresponse= await cache.match(filename);
   if(matchresponse){
       const originalBlob= await matchresponse.blob();
       console.log("Found in cache! Size:", originalBlob.size, "bytes"); // Is this > 0?
       const typedBlob = new Blob([originalBlob], { type: fileType || 'image/png' });
       return URL.createObjectURL(typedBlob)
   }
   return null;
}
function OfflineStore() {
    let [img,setImg]=useState([])
    let [file,setFile]=useState([]);
    let [video,setVideo]=useState([]);
    
    useEffect(()=>{
    // This listens to EVERYTHING happening in your 'downloaded_files' DB
  db.changes({
      since:'now',
      live:true,
      include_docs:true,
  }).on('change',(change)=>{
      console.log('downloaded files are updated in pouchdb',change.doc);
  })
},[])
  useEffect(()=>{
    const loadAndFilterFiles = async () => {
      const items=await db.allDocs({include_docs:true});
       const docs= items.rows
      .map(row=>({
          filename:row.doc.filename,
          type:row.doc.type,
      }))
       let imageBatch=[]
       let videoBatch=[]
       let docsBatch=[];
       for(const item of docs){
           const url=await offlineFilesUrl(item.filename,item.type);
           if(!url) continue;
           const mimetype=item.type.toLowerCase();
           if(mimetype.startsWith('image/'))  imageBatch.push(url);
           else if(mimetype.startsWith('video/'))   videoBatch.push(url)
           else if(mimetype.includes('pdf')) docsBatch.push(url)
         }
           setImg(imageBatch)        
        setFile(docsBatch)        
        setVideo(videoBatch) 
    }
    loadAndFilterFiles();       
        },[])

        return (
            <div>
                <h1 className='text-4xl text-green-500 font-extrabold'>DashBoard</h1>
                  <div className="relative flex w-full flex-col overflow-hidden ">
          <div className=" w-full flex flex-wrap justify-center">
            {img.map((item,index)=>(
              <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
                <img src={item} alt="img" className="w-full bg-cover flex"></img>
              </div>))}
            {/* {file.map((item,index)=>(
              <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
              <iframe src={item} alt="file" className="w-full bg-cover flex"></iframe>
              </div>))} */}
              {video.map((item,index)=>(
                <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
                  <video src={item} controls alt="video" className="w-full bg-cover flex"></video>
                </div>))}
                   {file.map((item, index) => (
           <div 
                   key={index} 
                    className="flex items-center bg-[#202c33] text-white w-72 p-3 m-3 rounded-lg border-l-4 border-green-500 cursor-pointer hover:bg-[#2a3942] transition-all"
                 >
        {/* File Icon Area */}
        <div className="bg-[#111b21] p-3 rounded-md mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
        </div>

        {/* File Info */}
        <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{item}</p>
            <p className="text-[10px] text-gray-400 uppercase">
                {item.split('.').pop()} Document
            </p>
        </div>

        {/* Download Icon */}
        <a 
            href={item} 
            download 
            className="ml-2 text-gray-400 hover:text-white"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
        </a>
    </div>
               ))}

          </div>
        </div>
            </div>
        )
}

export default  OfflineStore


