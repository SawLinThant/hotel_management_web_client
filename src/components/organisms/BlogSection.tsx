import React from 'react';
import BlogCard from '@/components/molecules/BlogCard';
import Button from '@/components/atoms/Button';
import { BlogPost } from '@/types/property';

interface BlogSectionProps {
  title: string;
  blogs: BlogPost[];
  className?: string;
}

const BlogSection: React.FC<BlogSectionProps> = ({
  title,
  blogs,
  className
}) => {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="text-center">
          <Button variant="primary" size="lg">
            View All Blogs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 