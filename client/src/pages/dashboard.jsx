import React, { useEffect, useState } from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

function Dashboard() {

    const [img,setImg]=useState([])
const handlefiles=async ()=>{
  try{
    const response=await fetch('http://localhost:3000/',{
         method:'GET',
    })

    if(!response.ok){
        throw new Error(`Server responded with status:${response.status}`);
    }
    else{
        const urls=await response.json();
        if(urls.url && Array.isArray(urls.url))
        setImg(prev=>[...prev,...urls.url]);
        }
    }
  catch(error){
    console.error("Fetch failed:", error.message);
  }
}
useEffect(()=>{
    handlefiles();
},[])
    return (
        <div>
            <h1 className='text-4xl text-green-500 font-extrabold'>DashBoard</h1>
              <div
      className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <div className="mt-60 w-full flex">
        {img.map((item,index)=>(
          <div key={index} className="bg-black w-67 h-66 rounded-2xl flex m-12 overflow-hidden" >
            <img src={item} alt="img" className="w-full bg-cover flex"></img>
          </div>))}
      </div>
    </div>
        </div>
    )
}

export default Dashboard;
        {/* <h2
          className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          Interactive Background Boxes Ripple Effect
        </h2>
        <p
          className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Hover over the boxes above and click.To be used on backgrounds of hero
          sections OR Call to Action sections. I beg you don&apos;t use it
          everywhere.
        </p> */}