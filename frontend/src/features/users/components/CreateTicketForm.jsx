import React, { useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';

const CreateTicketForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    // status: 'Open',
    attachment: null,
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await onSubmit(formData);
  };
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Brief summary of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Detailed explanation of the issue"
              />
            </div>

            {/* Priority and Sttatus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div> */}
            </div>

            {/* File Upload */}
            <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 ${
              dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            } cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 text-center">
                {formData.attachment ? (
                  <span className="text-blue-600 font-medium">
                    {formData.attachment.name}
                  </span>
                ) : (
                  <>
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </>
                )}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>
        </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketForm;