import React, { useState } from 'react';
import { BlogPost } from '@/types/property';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, className }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = blog.image ? (blog.image.startsWith('/') ? blog.image : `/${blog.image}`) : null;

  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow', className)}>
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {blog.wordCount} words
        </p>
      </div>
    </div>
  );
};

export default BlogCard; 