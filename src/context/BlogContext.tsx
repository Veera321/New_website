import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  imageWidth: number;
  imageHeight: number;
  author: string;
  publishDate: string;
  summary: string;
  tags: string[];
  status: 'draft' | 'published';
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlogById: (id: string) => Blog | undefined;
  publishBlog: (id: string) => void;
  unpublishBlog: (id: string) => void;
}

const initialBlogs: Blog[] = [
  {
    id: '1',
    title: 'Understanding Blood Tests: A Complete Guide',
    content: 'Blood tests are an essential diagnostic tool that helps doctors evaluate how well your organs are working and identify various diseases...',
    category: 'Health Tips',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        width: 800,
        height: 400,
      }
    ],
    imageWidth: 800,
    imageHeight: 400,
    author: 'Dr. Sarah Johnson',
    publishDate: new Date().toISOString(),
    summary: 'Learn about different types of blood tests and what they can tell you about your health.',
    tags: ['Blood Tests', 'Health', 'Diagnostics'],
    status: 'published'
  }
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Load blogs from localStorage on mount
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      try {
        const parsedBlogs = JSON.parse(savedBlogs);
        setBlogs(parsedBlogs);
      } catch (error) {
        console.error('Error parsing blogs from localStorage:', error);
        setBlogs(initialBlogs);
        localStorage.setItem('blogs', JSON.stringify(initialBlogs));
      }
    } else {
      // If no blogs in localStorage, set initial blogs
      setBlogs(initialBlogs);
      localStorage.setItem('blogs', JSON.stringify(initialBlogs));
    }
  }, []);

  const saveBlogs = (newBlogs: Blog[]) => {
    try {
      localStorage.setItem('blogs', JSON.stringify(newBlogs));
      setBlogs(newBlogs);
    } catch (error) {
      console.error('Error saving blogs to localStorage:', error);
    }
  };

  const addBlog = (blog: Omit<Blog, 'id'>) => {
    const newBlog = {
      ...blog,
      id: Date.now().toString(),
      status: 'draft' as const,
      images: blog.images || [], // Ensure images array exists
    };
    const updatedBlogs = [...blogs, newBlog];
    saveBlogs(updatedBlogs);
  };

  const updateBlog = (id: string, updatedBlog: Partial<Blog>) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    );
    saveBlogs(updatedBlogs);
  };

  const deleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    saveBlogs(updatedBlogs);
  };

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  const publishBlog = (id: string) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id ? { ...blog, status: 'published' as const, publishDate: new Date().toISOString() } : blog
    );
    saveBlogs(updatedBlogs);
  };

  const unpublishBlog = (id: string) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id ? { ...blog, status: 'draft' as const } : blog
    );
    saveBlogs(updatedBlogs);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        getBlogById,
        publishBlog,
        unpublishBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
