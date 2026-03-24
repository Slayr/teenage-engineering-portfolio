'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';

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
  },
  {
    id: 4,
    name: 'teenage-engineering-portfolio',
    description: 'A sleek, modern personal portfolio inspired by Teenage Engineering design ethos.',
    html_url: 'https://github.com',
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  }
];

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Slayr/repos?sort=updated&per_page=100');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((r: any) => !r.archived && !r.disabled);
          setRepos(filtered.length > 0 ? filtered : mockRepos);
        } else {
          setRepos(mockRepos);
        }
      } catch (error) {
        console.error('Failed to fetch repos', error);
        setRepos(mockRepos);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <Github size={36} />
          Projects
        </h1>
        <p className="te-label mt-4">Public repositories and experiments.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center te-label border border-dashed border-line">
          Loading repositories...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <motion.div 
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="te-card p-6 cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedRepo(repo)}
            >
              <h3 className="font-bold text-lg mb-2 truncate">{repo.name}</h3>
              <p className="text-sm text-ink/70 mb-4 line-clamp-3 flex-1">
                {repo.description || 'No description available.'}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 te-border-t">
                <span className="te-pill">{repo.language || 'Code'}</span>
                <span className="te-label">{format(new Date(repo.updated_at), 'MMM yyyy')}</span>
              </div>
            </motion.div>
          ))}
          {repos.length === 0 && (
            <div className="col-span-full py-12 text-center te-label border border-dashed border-line">
              No projects found.
            </div>
          )}
        </div>
      )}

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
    </div>
  );
}
