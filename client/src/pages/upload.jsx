import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

function Upload() {
  const [files, setFiles] = useState([]);

  const upload = async (selectedFiles) => {
    setFiles(selectedFiles);
    console.log(selectedFiles);

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Select a file first");
      return;
    }

    await handleFileUpload(selectedFiles[0]); // ✅ pass file directly
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ single file

      const res = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      console.log(result);
      alert("Upload successful");
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={upload} />
    </div>
  );
}

export default Upload;
