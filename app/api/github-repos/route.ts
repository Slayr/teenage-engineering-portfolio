import { NextResponse } from 'next/server';

const DEFAULT_GITHUB_USERNAME = 'RishiMihirPopat';
const MAX_REPOS = 3;

type RepoShape = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
};

type PinnedRepoNode = {
  databaseId: number;
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string } | null;
  updatedAt: string;
  stargazerCount: number;
  forkCount: number;
};

function toRepoShape(repo: {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
}): RepoShape {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description ?? '',
    html_url: repo.html_url,
    language: repo.language ?? '',
    updated_at: repo.updated_at,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
  };
}

async function fetchPinnedRepos(username: string, token: string): Promise<RepoShape[]> {
  const query = `
    query($username: String!, $count: Int!) {
      user(login: $username) {
        pinnedItems(first: $count, types: REPOSITORY) {
          nodes {
            ... on Repository {
              databaseId
              name
              description
              url
              primaryLanguage { name }
              updatedAt
              stargazerCount
              forkCount
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username, count: MAX_REPOS },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const nodes = (data?.data?.user?.pinnedItems?.nodes ?? []) as Array<PinnedRepoNode | null>;

  return nodes.map((repo) => ({
    id: repo?.databaseId,
    name: repo?.name,
    description: repo?.description ?? '',
    html_url: repo?.url,
    language: repo?.primaryLanguage?.name ?? '',
    updated_at: repo?.updatedAt,
    stargazers_count: repo?.stargazerCount,
    forks_count: repo?.forkCount,
  })).filter((repo): repo is RepoShape => Boolean(repo.id && repo.name && repo.html_url && repo.updated_at));
}

async function fetchRecentRepos(username: string): Promise<RepoShape[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&type=owner`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as GitHubRepo[];

  return data
    .filter((repo) => !repo.archived && !repo.disabled)
    .slice(0, MAX_REPOS)
    .map((repo) => toRepoShape(repo));
}

export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;

  try {
    const token = process.env.GITHUB_TOKEN;

    if (token) {
      const pinnedRepos = await fetchPinnedRepos(username, token);
      if (pinnedRepos.length > 0) {
        return NextResponse.json({ repos: pinnedRepos, source: 'pinned' });
      }
    }

    const recentRepos = await fetchRecentRepos(username);
    return NextResponse.json({ repos: recentRepos, source: 'recent' });
  } catch {
    return NextResponse.json({ repos: [], source: 'none' }, { status: 500 });
  }
}
