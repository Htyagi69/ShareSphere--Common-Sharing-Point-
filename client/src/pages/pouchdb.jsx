import React , { useEffect, useState } from 'react'
import PouchDb from 'pouchdb'
import {save} from './OfflineStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2,FileImage,FileVideo,FileAudio,FileText,File,Download,ExternalLink } from 'lucide-react';
function Pouchdb() {
    //Initialize the local database (this lives on the user's disk)
    const db=new PouchDb('Share_Local')
    window.db=db;
    //points to couchDb
    // const remoteDB=new PouchDb(`http://${import.meta.env.VITE_USER}:${import.meta.env.VITE_PASSWORD}@127.0.0.1:5984/demo`)
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
    //  const [isDownloading,setIsDownloading]=useState(false);
     const [downloadingId, setDownloadingId] = useState(null)
       async function handleDownload(url,name,type){
        //    setIsDownloading(true);
           setDownloadingId(name)
           try{
            await save(url,name,type);
           }catch (error) {
               console.error("Download failed", error);
            } finally {
            //   setIsDownloading(false); 
              setDownloadingId(null);
             }
       }
 const [deleteId, setDeleteId] = useState(null)
       async function handleDelete(name){
           setDeleteId(name);
           try{
              const res=await fetch("https://sharesphere-common-sharing-point-2.onrender.com/deleteFile",{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({fileName:name}),
                credentials:'include',
              })
              if(!res.ok){
                toast.error("Delted Failed",{ position: "bottom-right"})
              }
              const status=await res.json();
              console.log("Deleted File",status.message);
                setFiles(prev=> prev.filter(file=>file.name!==name));
                toast.success("Delted Successfully",{ position: "bottom-right" });
           }catch (error) {
               console.error("Deletion failed", error);
            } finally {
              setDeleteId(null);
             }
       }

    const SEEN_KEY='shareSphere_seenFiles'
const [seenFiles,setSeenFiles]=useState(()=>{
    try{
    return JSON.parse(localStorage.getItem(SEEN_KEY)||'[]')
    }catch{
        return [];
    }
})
 const markseenFiles=(name)=>{
     if(!seenFiles.includes(name)){
        localStorage.setItem(SEEN_KEY,JSON.stringify([...seenFiles,name]));
        setSeenFiles(prev=>[...prev,name])
     }
 }
 const isNew=(name)=>{
    console.log("filename",name);
     return !seenFiles.includes(name);
 }
   const getFileIcon=(type)=>{
    if(!type) <File size={12}/>
    if(type.startsWith('image/')) return <FileImage size={16}  className="text-blue-500"/>
    if(type.startsWith('video/')) return <FileVideo size={16} className="text-purple-500" />
    if(type.startsWith('audio/')) return <FileAudio size={16} className="text-green-500"/>
    if (type === 'application/pdf') return <FileText size={16} className="text-red-500" />;
    return <File size={12} className="text-gray-500" />;
 }
const isExpired=(urlExpiresAt)=>{
    if (!urlExpiresAt) return true;
    return Date.now() > new Date(urlExpiresAt).getTime();
}    
const getTimeLeft=(urlExpiresAt)=>{
    if (!urlExpiresAt) return 'Expired';
    const diff=new Date(urlExpiresAt).getTime() - Date.now();
    if(diff<=0) return "Expired";
    const mins=Math.floor(diff/(60*1000));
      if (mins < 1) return 'Expiring soon';
    return `${mins} min left`;
}
       return (
        <div>
        <div  className='p-2 font-serif mt-5'>
            <h2>ShareSphere Offline Storage ({files.length} files)</h2>
            <div className='flex justify-center items-center flex-col  gap-2.5'>
                {files.map(file => (
                    <div key={file._id} style={{ border: '1px solid #ddd' }} className={`p-2.5 rounded-xl w-70 ${isNew(file.name)?'bg-green-300':'bg-white'}`}>
                        <div className='flex justify-evenly items-center p-1'>
                            <strong> {getFileIcon(file.type)}</strong>
                            <strong>{file.name}</strong>
                          {isNew(file.name) && (
                        <>
                            <span className='bg-green-600 text-white text-xs px-2 py-0.5 rounded-full'>
                                     NEW
                            </span>
                            <span className={`text-xs ${isExpired(file.urlExpiresAt) ? 'text-red-500' : 'text-green-600'}`}>
                              {getTimeLeft(file.urlExpiresAt)}</span>
                        </>
                             )} </div>
                        <div className='gap-4 flex justify-evenly'>
                        <a href={file.url} target="_blank" rel="noreferrer" className='bg-black p-1 flex justify-center items-center text-white rounded-sm cursor-pointer'><ExternalLink size={16} /></a>
                        {/* <p  className='text-[10px] text-gray-800 flex border-2'>Type: {file.type}</p> */}
                        <Button id='download' variant='default' onClick={()=> handleDownload(file.url,file.name,file.type)} 
                         className='flex justify-center items-center p-1 text-white rounded-sm cursor-pointer' disabled={downloadingId===file.name}>
                            {  downloadingId===file.name ? (
                                <>
                                  <span className="animate-spin mr-2">🌀</span> 
                                     Processing...
                                </>
                            ):(
                                <>
                                 <Download size={16} />
                            Download
                                </>
                            )}
                            </Button>
                        <Button id='delete' onClick={()=> handleDelete(file.name)} 
                         className='flex justify-center items-center  bg-transparent text-red-500 border-red-500 border-2 rounded-sm cursor-pointer hover:bg-red-200' 
                         disabled={deleteId===file.name}>
                            {  deleteId===file.name ? (
                                <>
                                  <span className="animate-spin mr-2">🌀</span> 
                                     Deleting...
                                </>
                            ):(
                                <>
                            <Trash2 size={16} /> 
                               Delete
                                </>
                            )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default Pouchdb


