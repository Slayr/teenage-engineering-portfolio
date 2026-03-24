'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trash2 } from 'lucide-react';
import { fetchAllPosts, deletePost, Post } from '@/lib/storage';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { extractDataImages, createImgRenderer } from '@/lib/markdown';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await fetchAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
      alert('Failed to delete post. Check console for details.');
    }
  };

  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <BookOpen size={36} className="text-accent" />
          Blog
        </h1>
        <p className="te-label mt-4">Transmissions, thoughts, and technical deep dives.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center te-label border border-dashed border-line rounded-2xl">
          Loading transmissions...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="te-card cursor-pointer flex flex-col h-full overflow-hidden"
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <div className="w-full h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-xl mb-4 line-clamp-3">{post.title}</h3>
              <div className="mt-auto pt-4 te-border-t flex items-center justify-between">
                <span className="te-label">
                  {post.createdAt ? format(new Date(post.createdAt), 'MMM dd, yyyy') : 'Recently'}
                </span>
                <span className="te-pill bg-ink text-bg">Read</span>
              </div>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-12 text-center te-label border border-dashed border-line rounded-2xl">
              No blog posts yet.
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title || 'Blog Post'}
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 te-border-b">
              <span className="te-label">
                Published: {selectedPost.createdAt ? format(new Date(selectedPost.createdAt), 'MMM dd, yyyy') : 'Unknown'}
              </span>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(selectedPost.id)}
                  className="text-accent hover:text-ink transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
            {selectedPost.imageUrl && (
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full max-h-80 object-cover" />
              </div>
            )}
            {(() => {
              const { processed, images } = extractDataImages(selectedPost.content);
              return (
                <div className="prose prose-neutral max-w-none font-sans prose-headings:font-sans prose-headings:font-bold prose-a:text-accent dark:prose-invert prose-img:rounded-xl prose-img:w-full">
                  <ReactMarkdown components={{ img: createImgRenderer(images) }}>{processed}</ReactMarkdown>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}
