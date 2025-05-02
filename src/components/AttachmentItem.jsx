import React from "react";
import { File } from "lucide-react";

const AttachmentItem = ({ attachment }) => {
  // Parse mimetype to get a friendly document type
  const getDocumentType = (mimetype) => {
    if (!mimetype) return "Unknown";

    const mimeMap = {
      "application/pdf": "PDF",
      "image/jpeg": "JPEG",
      "image/png": "PNG",
      "image/gif": "GIF",
      "application/msword": "DOC",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "application/vnd.ms-excel": "XLS",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
      "application/vnd.ms-powerpoint": "PPT",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "PPTX",
      "text/plain": "TXT",
      "text/html": "HTML",
      "application/zip": "ZIP",
      "video/mp4": "MP4",
      "audio/mpeg": "MPEG",
    };

    return mimeMap[mimetype] || mimetype.split("/")[1].toUpperCase();
  };

  // Get appropriate thumbnail or use placeholder
  const getThumbnail = () => {
    if (attachment.thumbnails && attachment.thumbnails.card_cover) {
      return attachment.thumbnails.card_cover.url;
    } else if (attachment.signedUrl) {
      return attachment.signedUrl;
    }
    return null;
  };

  const thumbnail = getThumbnail();
  const documentType = getDocumentType(attachment.mimetype);
  const title = attachment.title || attachment.name || "Untitled";

  return (
    <div className="flex items-center p-2 bg-white rounded border border-gray-200 shadow-sm">
      <div className="w-10 h-10 flex items-center justify-center mr-3 bg-gray-100 rounded">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <File size={20} className="text-gray-500" />
        )}
      </div>
      <div className="flex-grow">
        <div className="text-sm font-medium truncate max-w-xs" title={title}>
          {title}
        </div>
        <div className="text-xs text-gray-500">{documentType}</div>
      </div>
    </div>
  );
};

export default AttachmentItem;
