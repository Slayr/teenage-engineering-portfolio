import { useState, useEffect } from 'react';
import { Repo, mockRepos } from '@/lib/data';

export function useGithubRepos() {
  const [repos, setRepos] = useState<Repo[]>(mockRepos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveGithubRepos = async () => {
      try {
        const res = await fetch('/api/github-repos');
        if (res.ok) {
          const data = await res.json();
          const liveRepos = Array.isArray(data?.repos) ? data.repos : [];
          if (liveRepos.length > 0) {
            setRepos(liveRepos);
          }
        }
      } catch (error) {
        console.warn('Live repos fetch failed, using local mockRepos');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGithubRepos();
  }, []);

  return { repos, loading };
}
