import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

function Upload() {
  const {roomName}=useParams()
  const [files, setFiles] = useState([]);

  const upload = async (selectedFiles) => {
    setFiles(selectedFiles);
    console.log(selectedFiles);

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Select a file first");
      return;
    }

    await handleFileUpload(selectedFiles[0]);
  };
  const uploadAPI=`${import.meta.env.VITE_API_BASE_URL}/${roomName}/uploads`;
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 

      const res = await fetch(uploadAPI,{
        method: "POST",
        body: formData,
        credentials:'include',
      });

      if (!res.ok) {
        const error=await res.json()
        throw new Error(error.message);
      }

      const result = await res.json();
      console.log(result);
      toast.success("Uploaded Successfully")
      window.location.href=`/${roomName}`
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={upload} />
    </div>
  );
}

export default Upload;
