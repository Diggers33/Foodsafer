import { useState, useRef } from 'react';
import { X, Upload as UploadIcon, FileText, Image as ImageIcon, File, CheckCircle } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface UploadFileProps {
  onClose: () => void;
  workspaceId: string;
}

export function UploadFile({ onClose }: UploadFileProps) {
  const [files, setFiles] = useState<{ name: string; size: number; type: string; url: string }[]>([]);
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['General', 'Documents', 'Images', 'SOPs', 'Certificates'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        const reader = new FileReader();
        return new Promise<{ name: string; size: number; type: string; url: string }>((resolve) => {
          reader.onloadend = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              url: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newFiles).then(fileData => {
        setFiles([...files, ...fileData]);
      });
    }
  };

  const handleUpload = () => {
    const uploadData = {
      files,
      description,
      folder: selectedFolder,
      timestamp: new Date().toISOString(),
    };
    console.log('Uploading files:', uploadData);
    // In a real app, this would upload to the backend
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const isValid = files.length > 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>Upload Files</h1>
          <button 
            onClick={handleUpload}
            className="text-[#2E7D32] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Upload
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* User Info */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="You" className="w-full h-full object-cover" />
            </Avatar>
            <div>
              <h4>You</h4>
              <p className="text-sm text-[#757575]">Uploading files</p>
            </div>
          </div>

          {/* Folder Selection */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block">Upload to</label>
            <div className="flex flex-wrap gap-2">
              {folders.map((folder) => (
                <Badge
                  key={folder}
                  onClick={() => setSelectedFolder(folder.toLowerCase())}
                  className={`cursor-pointer ${
                    selectedFolder === folder.toLowerCase()
                      ? 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                      : 'bg-gray-200 text-[#757575] hover:bg-gray-300'
                  }`}
                >
                  {folder}
                </Badge>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2E7D32] hover:bg-[#F5F5F5] transition-colors"
          >
            <UploadIcon className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <p className="text-[#212121] mb-1">Click to upload files</p>
            <p className="text-sm text-[#757575]">Supports documents, images, PDFs, and more</p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />

          {/* Description */}
          {files.length > 0 && (
            <div className="mt-4">
              <label className="text-sm text-[#757575] mb-2 block">Description (Optional)</label>
              <textarea
                placeholder="Add a description for these files..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
              Selected Files ({files.length})
            </h4>
            <div className="space-y-2">
              {files.map((file, idx) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded">
                    <FileIcon className="w-5 h-5 text-[#2E7D32]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-[#757575]">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-[#D32F2F]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
