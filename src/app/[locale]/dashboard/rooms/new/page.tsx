'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { roomService } from '@/services/roomService';
import type { CreateRoomPayload } from '@/types/room';

export default function NewRoomPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CreateRoomPayload>({
    room_number: '',
    type: 'single',
    capacity: 1,
    price_per_night: 0,
    amenities: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    setSelectedFiles(imageFiles);
    
    // Create previews
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError(null);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URLs to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Create room with image files - backend will handle upload to Cloudinary
      await roomService.createRoom(form, selectedFiles.length > 0 ? selectedFiles : undefined);

      // Clean up preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Failed to create room');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 text-black">
      <h2 className="text-xl font-semibold">Create New Room</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm">Room Number</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} required />
        </label>
        <label className="block">
          <span className="text-sm">Type</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Capacity</span>
          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
        </label>
        <label className="block">
          <span className="text-sm">Price per night</span>
          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })} />
        </label>
      </div>
      <div>
        <span className="text-sm">Description</span>
        <textarea className="mt-1 w-full border rounded px-3 py-2" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      
      {/* Image Upload Section */}
      <div className="block">
        <span className="text-sm block mb-2">Room Images</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can select multiple images. Supported formats: JPG, PNG, GIF, WebP
        </p>
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed" 
        disabled={saving}
      >
        {saving ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}


