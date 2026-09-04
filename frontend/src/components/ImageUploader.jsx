import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const ImageUploader = ({ onImageSelected, selectedFile, previewUrl }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 group bg-slate-900 h-64">
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-cyan-400" /> Change Photo
            </button>
            <button
              type="button"
              onClick={() => onImageSelected(null)}
              className="px-3.5 py-2 rounded-xl bg-rose-900/90 text-white text-xs font-semibold hover:bg-rose-800 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-lg text-xs font-medium text-emerald-300 flex items-center gap-1.5 border border-emerald-500/40 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Image Ready for AI Scan
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/70'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100">
              Upload photo or take a picture
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Drag & drop image file here, or click to browse (JPG, PNG, WEBP max 10MB)
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-cyan-400 border border-slate-700">
            <Camera className="w-4 h-4" /> Snap Photo with Camera
          </div>
        </div>
      )}
    </div>
  );
};
