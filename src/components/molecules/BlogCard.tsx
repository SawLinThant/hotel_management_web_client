import React from 'react';
import { BlogPost } from '@/types/property';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, className }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow', className)}>
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
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