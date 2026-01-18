import React , { useEffect, useState } from 'react'
//for showing public folder url
function Store() {
    let [img,setImg]=useState([]);
    let [file,setFile]=useState([]);
    let [video,setVideo]=useState([]);
    
     useEffect(()=>{
        fetch('https://sharesphere-common-sharing-point-2.onrender.com/list')
        .then(res=>res.json())
        .then(data=>{
            const images=[]
            const pdfs=[]
            const videos=[]
            data.forEach(filename=>{
                let name=filename.toLowerCase();
            if(/\.(jpg|jpeg|png|gif|webp)$/.test(name)){
            images.push(filename);
            }
            else if(name.endsWith('.pdf')){
                pdfs.push(filename)
            }
            else if(/\.(mp4|webm|ogg|mov)$/.test(name)){
                videos.push(filename)
            }
        })
                setImg(images);
                setFile(pdfs);
                setVideo(videos);
            console.log("Images",data);
     })
     },[])

     const SERVER_URL = 'http://localhost:3000/files';
        return (
            <div>
                <h1 className='text-4xl text-green-500 font-extrabold'>Local</h1>
                  <div className="relative flex w-full flex-col overflow-hidden ">
          <div className=" w-full flex flex-wrap justify-center">
            {img.map((item,index)=>(
              <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
                <img src={`${SERVER_URL}/${item}`} alt="img" className="w-full bg-cover flex"></img>
              </div>))}
            {/* {file.map((item,index)=>(
              <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
              <iframe src={`${SERVER_URL}/${item}`} alt="file" className="w-full bg-cover flex"></iframe>
              </div>))} */}
              {video.map((item,index)=>(
                <div key={index} className="bg-black w-78 h-66 rounded-2xl flex m-3 overflow-hidden">
                  <video src={`${SERVER_URL}/${item}`} controls alt="video" className="w-full bg-cover flex"></video>
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
            href={`${SERVER_URL}/${item}`} 
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

export default Store


// import React, { useEffect, useState } from 'react';

// function Store() {
//     const [files, setFiles] = useState({ images: [], pdfs: [], videos: [] });

//     useEffect(() => {
//         fetch('http://localhost:3000/list')
//             .then(res => res.json())
//             .then(data => {
//                 const categorized = { images: [], pdfs: [], videos: [] };
                
//                 data.forEach(filename => {
//                     const name = filename.toLowerCase();
//                     if (/\.(jpg|jpeg|png|gif|webp)$/.test(name)) categorized.images.push(filename);
//                     else if (name.endsWith('.pdf')) categorized.pdfs.push(filename);
//                     else if (/\.(mp4|webm|mov)$/.test(name)) categorized.videos.push(filename);
//                 });

//                 setFiles(categorized);
//             });
//     }, []);

//     const renderItem = (item, type) => {
//         const url = `http://localhost:3000/files/${item}`;
//         const containerClass = "bg-black w-64 h-64 rounded-2xl flex m-4 overflow-hidden border border-gray-700";

//         return (
//             <div key={item} className={containerClass}>
//                 {type === 'img' && <img src={url} alt="img" className="w-full object-cover" />}
//                 {type === 'pdf' && <iframe src={url} title="pdf" className="w-full" />}
//                 {type === 'video' && <video src={url} controls className="w-full object-cover" />}
//             </div>
//         );
//     };

//     return (
//         <div className="p-10">
//             <h1 className='text-4xl text-green-500 font-extrabold mb-5'>DashBoard</h1>
//             <div className="flex flex-wrap border-4 p-4">
//                 {files.images.map(item => renderItem(item, 'img'))}
//                 {files.pdfs.map(item => renderItem(item, 'pdf'))}
//                 {files.videos.map(item => renderItem(item, 'video'))}
//             </div>
//         </div>
//     );
// }

// export default Store;
