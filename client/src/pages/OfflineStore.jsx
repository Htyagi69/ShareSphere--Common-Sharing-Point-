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
    //   console.log('BrowserUrl is===',uri);
      window.location.href='/';
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
    // This listens to EVERYTHING happening in  'downloaded_files' DB
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
          id:row.id,
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
           if(mimetype.startsWith('image/'))  imageBatch.push({id:item.id,url:url});
           else if(mimetype.startsWith('video/'))   videoBatch.push({id:item.id,url:url})
           else if(mimetype.includes('pdf')) docsBatch.push([item.id,item.filename,url])
         }
           setImg(imageBatch)        
        setFile(docsBatch)        
        setVideo(videoBatch) 
    }
    loadAndFilterFiles();       
        },[])

   const handleRemove=(itemId,url,type)=>{
        db.get(itemId).then((item)=>{
            if(type==="img") setImg((prev)=>prev.filter((file)=>file.id!==itemId))
            else if(type==="video") setVideo((prev)=>prev.filter((file)=>file.id!==itemId))
            else if(type==="doc") setFile((prev)=>prev.filter((file)=>file.id!==itemId))

            console.log("file removed successfully");
            return db.remove(item)
        }).catch((err)=>{
            console.log(err);   
        })
   }
        return (
            <div>
            <div className="relative flex w-full flex-col overflow-hidden mt-12">
          <div className=" w-full flex flex-wrap justify-center">
             {img.map((item) => (
               <div key={item.id}
                 className="relative bg-black w-56 h-35 rounded-2xl m-3 overflow-hidden"
               >
                 <a href={item.url} target="_blank" rel="noreferrer">
                   <img src={item.url} alt="img" className="w-full h-full object-cover"/>
                 </a>
             
                 <button onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     handleRemove(item.id, item.url, "img");
                   }}
                   className="absolute top-1 right-2 z-50 w-6 h-6 rounded-full bg-black/70 text-white hover:bg-red-600 flex items-center justify-center"
                 >×</button>
               </div>))}
            {/* {file.map((item,index)=>(
              <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
              <iframe src={item} alt="file" className="w-full bg-cover flex"></iframe>
              </div>))} */}
              {video.map((item)=>(
                <div key={item.id} className="relative bg-black w-56 h-35 rounded-2xl flex m-3 overflow-hidden">
                 <a href={item.url} target="_blank" rel="noreferrer">
                  <video src={item.url} controls alt="video" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
                  </a>
                    <button onClick={()=>{
                     e.preventDefault();
                     e.stopPropagation();
                     handleRemove(item.id, item.url, "video");
                   }}
                   className="absolute top-1 right-2 z-50 w-6 h-6 rounded-full bg-black/70 text-white hover:bg-red-600 flex items-center justify-center">
                  x</button>
                   </div>
                ))}

        {file.map(([id,name,url]) => (
           <div  key={id} 
           className="relative flex items-center bg-[#202c33] text-white w-72 h-26 p-3 m-3 rounded-lg border-l-4 border-green-500  hover:bg-[#2a3942] transition-all cursor-pointer"
              onClick={()=>window.open(url,"_blank")}   >
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
            <h2 className="text-sm font-medium truncate">{name}</h2>
            <p className="text-[10px] text-gray-400 uppercase">
                PDF Document
            </p>
        </div>

        <a href={url} download  className="ml-2 text-gray-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
        </a>
    <button onClick={()=>{
                     e.preventDefault();
                     e.stopPropagation();
                handleRemove(id,url,"doc")}}
              className="absolute top-1 right-2 z-50 w-6 h-6 rounded-full bg-black/70 text-white hover:bg-red-600 flex items-center justify-center">×</button>
    </div>
            ))}

          </div>
        </div>
            </div>
        )
}

export default  OfflineStore


