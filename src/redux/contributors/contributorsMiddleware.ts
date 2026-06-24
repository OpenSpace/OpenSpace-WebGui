import { createAsyncThunk } from '@reduxjs/toolkit';

import { GitHubContributor } from './contributorsSlice';

const repos = ['OpenSpace/OpenSpace', 'OpenSpace/OpenSpace-WebGui', 'OpenSpace/Ghoul'];

interface GitHubApiContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

async function fetchAllContributorsForRepo(repo: string): Promise<GitHubContributor[]> {
  const all: GitHubContributor[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`
    );
    if (!response.ok) {
      break;
    }
    const data: GitHubApiContributor[] = await response.json();
    if (data.length === 0) {
      break;
    }

    const humans = data
      .filter((c) => c.type === 'User')
      .map((c) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        htmlUrl: c.html_url,
        contributions: c.contributions
      }));

    all.push(...humans);

    if (data.length < 100) {
      break;
    }
    page++;
  }

  return all;
}

export const getContributors = createAsyncThunk(
  'contributors/getContributors',
  async () => {
    const results = await Promise.all(repos.map(fetchAllContributorsForRepo));

    const contributionMap = new Map<string, GitHubContributor>();

    for (const repoContributors of results) {
      for (const contributor of repoContributors) {
        const existing = contributionMap.get(contributor.login);
        if (existing) {
          existing.contributions += contributor.contributions;
        } else {
          contributionMap.set(contributor.login, { ...contributor });
        }
      }
    }

    return Array.from(contributionMap.values()).sort(
      (a, b) => b.contributions - a.contributions
    );
  }
);
