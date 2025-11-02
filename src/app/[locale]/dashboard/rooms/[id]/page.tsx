'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import { useUpdateRoom, useDeleteRoom } from '@/hooks/useUpdateRoom';
import { roomService } from '@/services/roomService';
import type { Room, UpdateRoomPayload } from '@/types/room';

export default function RoomEditPage() {
  const params = useParams<{ id: string; locale: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use hooks for data fetching and updates
  const { room: fetchedRoom, isLoading, error: fetchError } = useRoomDetail(id);
  const { updateRoom, isUpdating, error: updateError } = useUpdateRoom();
  const { deleteRoom, isDeleting } = useDeleteRoom();
  
  // Local state for form editing
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Sync fetched room to local state when it changes
  useEffect(() => {
    if (fetchedRoom) {
      setRoom(fetchedRoom);
    }
  }, [fetchedRoom]);

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

  const removeNewImage = (index: number) => {
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

  const handleDeleteImage = async (imageUrl: string) => {
    if (!room || !confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await roomService.deleteImage(id, imageUrl);
      // Update local state to remove deleted image
      if (room) {
        const updatedImages = (room.images || []).filter(img => img !== imageUrl);
        setRoom({ ...room, images: updatedImages });
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to delete image');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    
    try {
      const payload: UpdateRoomPayload = {
        type: room.type,
        capacity: Number(room.capacity),
        price_per_night: Number(room.price_per_night),
        description: room.description,
        amenities: room.amenities,
        images: room.images,
        floor: room.floor !== undefined && room.floor !== null ? Number(room.floor) : undefined,
        size_sqm: room.size_sqm !== undefined && room.size_sqm !== null ? Number(room.size_sqm) : undefined,
        status: room.status,
      };
      
      // Use roomService directly to pass images
      await roomService.updateRoom(id, payload, selectedFiles.length > 0 ? selectedFiles : undefined);
      
      // Clean up preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Failed to update room');
    }
  };

  const handleDelete = async () => {
    if (!room || !confirm(`Are you sure you want to delete room ${room.room_number}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteRoom(id);
      router.push(`/${params.locale}/dashboard/rooms`);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete room');
    }
  };

  // Combine errors
  const displayError = error || fetchError || (updateError as any);
  
  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (displayError) return <div className="text-red-600 p-4">{String(displayError)}</div>;
  if (!room) return null;

  return (
    <form onSubmit={handleSave} className="max-w-2xl mx-auto p-6 space-y-4 text-black">
      <h2 className="text-xl font-semibold">Edit Room {room.room_number}</h2>
      {displayError && <div className="text-red-600 text-sm">{String(displayError)}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm">Type</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={room.type} onChange={(e) => {
            if (room) setRoom({ ...room, type: e.target.value as any });
          }}>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Status</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={room.status} onChange={(e) => {
            if (room) setRoom({ ...room, status: e.target.value as any });
          }}>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Capacity</span>
          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={room.capacity} onChange={(e) => {
            if (room) setRoom({ ...room, capacity: Number(e.target.value) });
          }} />
        </label>
        <label className="block">
          <span className="text-sm">Price per night</span>
          <input type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" value={room.price_per_night} onChange={(e) => {
            if (room) setRoom({ ...room, price_per_night: Number(e.target.value) });
          }} />
        </label>
        <label className="block">
          <span className="text-sm">Floor</span>
          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={room.floor ?? ''} onChange={(e) => {
            if (room) setRoom({ ...room, floor: e.target.value ? Number(e.target.value) : undefined });
          }} />
        </label>
        <label className="block">
          <span className="text-sm">Size (sqm)</span>
          <input type="number" step="0.1" className="mt-1 w-full border rounded px-3 py-2" value={room.size_sqm ?? ''} onChange={(e) => {
            if (room) setRoom({ ...room, size_sqm: e.target.value ? Number(e.target.value) : undefined });
          }} />
        </label>
      </div>
      <div>
        <span className="text-sm">Description</span>
        <textarea className="mt-1 w-full border rounded px-3 py-2" value={room.description ?? ''} onChange={(e) => {
          if (room) setRoom({ ...room, description: e.target.value });
        }} />
      </div>
      
      {/* Existing Images Section */}
      {room.images && room.images.length > 0 && (
        <div>
          <span className="text-sm block mb-2">Current Images</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Room image ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Delete image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* New Image Upload Section */}
      <div className="block">
        <span className="text-sm block mb-2">Add New Images</span>
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
        
        {/* New Image Previews */}
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
                  onClick={() => removeNewImage(index)}
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
      
      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors" disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50 hover:bg-red-700 transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Room'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


