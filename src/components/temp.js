"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Copy, Check, X } from "lucide-react";

export default function UploadImage() {
  const [uploads, setUploads] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (url, index) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleUploadSuccess = (result) => {
    if (result.event === "success") {
      const newUpload = {
        url: result.info.secure_url,
        name: result.info.original_filename,
        timestamp: new Date().toISOString(),
      };

      setUploads((prev) => [...prev, newUpload]);
      localStorage.setItem(
        "uploadedImages",
        JSON.stringify([...uploads, newUpload])
      );
      console.log("✅ New Image Added:", newUpload);
    }
  };

  const removeUpload = (indexToRemove) => {
    setUploads((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <CldUploadWidget
          uploadPreset="Fictive"
          onSuccess={handleUploadSuccess}
          options={{
            multiple: true,
            maxFiles: 10,
          }}
        >
          {({ open }) => (
            <button
              onClick={open}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Upload Images (Multiple)
            </button>
          )}
        </CldUploadWidget>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Images ({uploads.length})
          </h3>

          <div className="grid gap-4">
            {uploads.map((upload, index) => (
              <div
                key={upload.timestamp}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {upload.name}
                  </h4>
                  <button
                    onClick={() => removeUpload(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={upload.url}
                      alt={upload.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <input
                        type="text"
                        value={upload.url}
                        readOnly
                        className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-300 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(upload.url, index)}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          copiedIndex === index
                            ? "bg-green-500 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                        }`}
                        title={copiedIndex === index ? "Copied!" : "Copy URL"}
                      >
                        {copiedIndex === index ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
