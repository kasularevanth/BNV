import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import { createMockup } from '../api/mockupApi';

const CATEGORIES = ['Packaging', 'Bottles', 'Apparel', 'Beverage', 'Electronics', 'Other'];
const FEATURES = ['Optimized for WebP', 'Auto-tagging enabled', 'Commercial License check'];

const UploadPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Beverage' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { setError('Please select an image'); return; }
    if (!form.name.trim()) { setError('Mockup name is required'); return; }
    if (form.price === '' || isNaN(form.price)) { setError('Valid price is required'); return; }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      await createMockup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/mockups'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/mockups')}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Mockup</h1>
            <p className="text-sm text-gray-500 mt-0.5">Add new mockup to your library</p>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Features sidebar — large screen only */}
          <div className="hidden lg:flex flex-col gap-3 w-48 flex-shrink-0 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Features
            </p>
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5" />
                {f}
              </div>
            ))}

            {/* Feature pills on large screen */}
            <div className="mt-4 bg-indigo-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-indigo-700 mb-2">Max file size</p>
              <p className="text-2xl font-bold text-indigo-600">20 MB</p>
              <p className="text-xs text-indigo-400 mt-1">PNG · JPG · WebP</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            {/* Mockup Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Mockup Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Minimalist Coffee Pouch v2"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the material, finish, and lighting setup..."
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
              />
            </div>

            {/* Price + Category — stacked on mobile, side-by-side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Mockup Preview
              </label>
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 sm:max-h-80 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 max-w-[70%] truncate">
                    {imageFile?.name}
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition ${
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
                    isDragActive ? 'bg-indigo-200' : 'bg-indigo-100'
                  }`}>
                    <CloudUpload className="w-7 h-7 text-indigo-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 text-center">
                    {isDragActive ? 'Drop here...' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or WebP · Max 20 MB</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Mockup uploaded successfully! Redirecting...
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 pb-4">
              <button
                type="button"
                onClick={() => navigate('/mockups')}
                className="w-full sm:w-auto px-6 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || success}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Mockup'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
