import React , { useEffect, useState } from 'react'
import PouchDb from 'pouchdb'
import {save} from './OfflineStore';
function Pouchdb() {
    //Initialize the local database (this lives on the user's disk)
    const db=new PouchDb('Share_Local')
    window.db=db;
    //points to couchDb
    // const remoteDB=new PouchDb(`http://${import.meta.env.VITE_USER}:${import.meta.env.VITE_PASSWORD}@127.0.0.1:5984/share-point`)
    const remoteDB=new PouchDb(`https://${import.meta.env.VITE_USER}:${import.meta.env.VITE_PASSWORD}@couchdb-3-00l8.onrender.com/share-point`)
    const [files,setFiles]=useState([])

    async function loadLocaldata(){
        const result=await db.allDocs({include_docs:true});
          const actualfiles=result.rows
          .map(row=>row.doc)
          .filter(doc=>doc.url)
          setFiles(actualfiles)
    }
 
       useEffect(()=>{
            loadLocaldata()
        // Start the "Sync"
        // This makes sure the local disk always matches the server
              let sync=db.sync(remoteDB,{
                live:true,
                retry:true,
              }).on('change',(change)=>{
                console.log('Data is up to date',change);
                loadLocaldata()
              }) 
              return ()=>sync.cancel() 
       },[])

       return (
        <div>
        <div  className='p-5 font-serif'>
            <h2>ShareSphere Offline Storage ({files.length} files)</h2>
            <div className='flex justify-center items-center  gap-2.5'>
                {files.map(file => (
                   <div key={file._id} style={{ border: '1px solid #ddd' }} className='p-2.5 rounded-xl w-150'>
                        <strong>📄 {file.name}</strong>
                        <div className='gap-4 flex justify-evenly'>
                        <a href={file.url} target="_blank" rel="noreferrer" className='bg-black p-1 text-white rounded-xl'>Open File</a>
                        <p  className='text-[12px] text-gray-800'>Type: {file.type}</p>
                        <button id='download' onClick={()=> save(file.url,file.name,file.type)} className='bg-black p-1 text-white rounded-xl'>Download</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default Pouchdb


