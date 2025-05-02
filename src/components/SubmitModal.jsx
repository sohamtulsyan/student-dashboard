import React, { useState } from "react";
import Button from "./Button"; // Import your custom Button component
import { uploadFile } from "@/api/backend"; // Adjust path if needed

const SubmitModal = ({ isOpen, onClose, isDragging, setIsDragging, Id }) => {
  const [selectedFiles, setSelectedFiles] = useState(null); // Manage selected files
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  // Dummy submit function
const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  setLoading(true); // Start loading

  try {
    let uploadedFiles = [];
    if (selectedFiles && selectedFiles.length > 0) {
      const files = Array.from(selectedFiles);
      // selectedFiles = Array.from(selectedFiles);
      for(let file in files){
        uploadedFiles.push(await uploadFile(file));
      }
    }

    onClose();
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to save image. Please try again.");
  } finally {
    setLoading(false); // Stop loading
  }
};

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Submit Assignment</h2>
          <Button onClick={onClose} text="✕" background="transparent" />
        </div>
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-yellow-400 bg-yellow-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="text-gray-500">
              <div className="text-lg mb-2">Drag and drop files here</div>
              <div className="text-sm">or</div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden" // Hide the default file input
                id="file-upload"
              />
              <div className="justify-center align-middle flex mt-4">
                <Button
                  text="Browse Files"
                  onClick={() => document.getElementById("file-upload").click()} // Trigger file input click
                />
              </div>
            </div>
          </div>

          {/* Display selected files */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Selected Files:</h3>
              <ul className="list-disc ml-6 mt-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              text="Cancel"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
            />
            <Button
              text={loading ? "Saving..." : "Submit"}
              onClick={handleSubmit} // Dummy submit logic
              className="bg-yellow-400 text-black px-4 py-2 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
