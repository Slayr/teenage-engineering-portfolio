'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Download, Github, BookOpen, ChevronDown } from 'lucide-react';
import { fetchAllPosts, Post } from '@/lib/storage';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { extractDataImages, createImgRenderer } from '@/lib/markdown';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
}

const mockRepos: Repo[] = [
  {
    id: 1,
    name: 'autonomous-drone-nav',
    description: 'Deep learning based autonomous navigation system for quadcopters using PyTorch and ROS.',
    html_url: 'https://github.com',
    language: 'Python',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'stratbeans-api',
    description: 'Scalable enterprise backend services built with ExpressJS and PostgreSQL.',
    html_url: 'https://github.com',
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 3,
    name: 'bio-stat-predictor',
    description: 'Machine learning models for predicting patient outcomes based on clinical data.',
    html_url: 'https://github.com',
    language: 'Jupyter Notebook',
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  }
];

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Slayr/repos?sort=updated&per_page=10');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((r: any) => !r.archived && !r.disabled).slice(0, 3);
          setRepos(filtered.length > 0 ? filtered : mockRepos);
        } else {
          setRepos(mockRepos);
        }
      } catch (error) {
        console.error('Failed to fetch repos', error);
        setRepos(mockRepos);
      }
    };

    const fetchPosts = async () => {
      try {
        const fetchedPosts = (await fetchAllPosts()).slice(0, 3);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchRepos();
    fetchPosts();
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col gap-8 pt-12 md:pt-20 pb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[18vw] md:text-[11vw] font-black leading-[0.85] tracking-tighter uppercase"
        >
          System<br /><span className="text-accent">Online</span>
        </motion.h1>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full mt-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden te-border bg-ink/5 shrink-0"
          >
            <Image 
              src="https://github.com/Slayr.png" 
              alt="Profile Photo" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex-1 space-y-8 text-center md:text-left">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-3xl max-w-2xl font-sans font-bold text-ink/80 tracking-tight leading-snug"
            >
              Hello, I&apos;m Slayr. I build modern, sleek, and functional software. 
              Welcome to my personal portfolio and digital playground.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="te-button te-button-accent flex items-center gap-2 text-base py-3 px-6 font-bold">
                <Download size={18} />
                Download Resume
              </a>
              <Link href="/contact" className="te-button flex items-center gap-2 text-base py-3 px-6 font-bold">
                Contact Me
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={28} className="text-ink/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* Latest Projects */}
      <section className="space-y-8 mt-12">
        <div className="flex items-center justify-between te-border-b pb-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase flex items-center gap-4">
            <Github size={36} className="text-accent" />
            Latest Projects
          </h2>
          <Link href="/projects" className="te-label hover:text-accent flex items-center gap-1 font-bold">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <motion.div 
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="te-card p-6 cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedRepo(repo)}
            >
              <h3 className="font-bold text-lg mb-2 truncate">{repo.name}</h3>
              <p className="text-sm text-ink/70 mb-4 line-clamp-2 flex-1">
                {repo.description || 'No description available.'}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 te-border-t">
                <span className="te-pill">{repo.language || 'Code'}</span>
                <span className="te-label">{format(new Date(repo.updated_at), 'MMM yyyy')}</span>
              </div>
            </motion.div>
          ))}
          {repos.length === 0 && (
            <div className="col-span-3 py-12 text-center te-label border border-dashed border-line rounded-2xl">
              No projects found.
            </div>
          )}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="space-y-8 mt-12">
        <div className="flex items-center justify-between te-border-b pb-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase flex items-center gap-4">
            <BookOpen size={36} className="text-accent" />
            Latest Transmissions
          </h2>
          <Link href="/blog" className="te-label hover:text-accent flex items-center gap-1 font-bold">
            Read All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="te-card p-6 cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPost(post)}
            >
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
              <div className="mt-auto pt-4 te-border-t">
                <span className="te-label">
                  {post.createdAt ? format(new Date(post.createdAt), 'MMM dd, yyyy') : 'Recently'}
                </span>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-12 text-center te-label border border-dashed border-line rounded-2xl">
              No blog posts yet.
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <Modal 
        isOpen={!!selectedRepo} 
        onClose={() => setSelectedRepo(null)}
        title={selectedRepo?.name || 'Project Details'}
      >
        {selectedRepo && (
          <div className="space-y-6">
            <p className="text-lg">{selectedRepo.description || 'No description provided.'}</p>
            <div className="flex flex-wrap gap-2">
              <span className="te-pill bg-ink text-bg">{selectedRepo.language || 'Code'}</span>
              <span className="te-pill">Updated: {format(new Date(selectedRepo.updated_at), 'MMM dd, yyyy')}</span>
            </div>
            <div className="pt-6 te-border-t">
              <a 
                href={selectedRepo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="te-button te-button-accent inline-flex items-center gap-2"
              >
                View on GitHub <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title || 'Blog Post'}
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="te-label pb-4 te-border-b">
              Published: {selectedPost.createdAt ? format(new Date(selectedPost.createdAt), 'MMM dd, yyyy') : 'Unknown'}
            </div>
            {(() => {
              const { processed, images } = extractDataImages(selectedPost.content);
              return (
                <div className="prose prose-neutral max-w-none font-sans prose-img:rounded-xl prose-img:w-full">
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
