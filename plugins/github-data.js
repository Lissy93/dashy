const REPO = 'lissy93/dashy';
const MAX_TAG_DATE_FETCHES = 20;

function stripMarkdown(text) {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/[*_~`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return { json: await res.json(), headers: res.headers };
}

async function fetchAllContributors(headers) {
  const allContributors = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { json: data } = await fetchJson(
      `https://api.github.com/repos/${REPO}/contributors?per_page=${perPage}&page=${page}`,
      headers,
    );
    if (!Array.isArray(data) || data.length === 0) break;
    allContributors.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return allContributors;
}

module.exports = function githubDataPlugin(context) {
  return {
    name: 'github-data',

    async loadContent() {
      const token = context.siteConfig.customFields?.githubToken || process.env.GITHUB_TOKEN || '';
      const headers = { 'User-Agent': 'dashy-docs' };
      if (token) headers['Authorization'] = `token ${token}`;

      const data = {
        releases: null,
        tags: null,
        commits: null,
        contributors: null,
        sponsors: null,
        starCount: null,
        dockerPulls: null,
        contributorCount: null,
        latestTag: null,
      };

      // Fetch all sources in parallel, each wrapped in try/catch
      const [
        releasesResult,
        tagsResult,
        commitsResult,
        contributorsResult,
        sponsorsResult,
        repoResult,
        dockerResult,
        contributorCountResult,
      ] = await Promise.allSettled([
        fetchJson(`https://api.github.com/repos/${REPO}/releases?per_page=100`, headers),
        fetchJson(`https://api.github.com/repos/${REPO}/tags?per_page=100`, headers),
        fetchJson(`https://api.github.com/repos/${REPO}/commits?per_page=30&page=1`, headers),
        fetchAllContributors(headers),
        fetchJson('https://github-sponsors-api.as93.net/lissy93', headers),
        fetchJson(`https://api.github.com/repos/${REPO}`, headers),
        fetchJson('https://hub.docker.com/v2/repositories/lissy93/dashy/', headers),
        fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=1&anon=true`, { headers }),
      ]);

      // Releases — trim to only what components need
      if (releasesResult.status === 'fulfilled') {
        data.releases = releasesResult.value.json.map(r => ({
          tag_name: r.tag_name,
          name: r.name,
          published_at: r.published_at,
          body: r.body ? stripMarkdown(r.body).slice(0, 200) : '',
          html_url: r.html_url,
          author_login: r.author?.login,
          author_avatar: r.author?.avatar_url,
        }));
      }

      // Tags — resolve dates for non-release tags
      if (tagsResult.status === 'fulfilled') {
        const rawTags = tagsResult.value.json;
        const releaseTagNames = data.releases
          ? new Set(data.releases.map(r => r.tag_name))
          : new Set();

        const nonReleaseTags = rawTags
          .filter(t => !releaseTagNames.has(t.name))
          .slice(0, MAX_TAG_DATE_FETCHES);

        const tagDateResults = await Promise.allSettled(
          nonReleaseTags.map(t =>
            fetchJson(`https://api.github.com/repos/${REPO}/commits/${t.commit.sha}`, headers)
              .then(({ json: c }) => ({
                name: t.name,
                date: c.commit.author.date,
              }))
          )
        );

        data.tags = tagDateResults
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value);

        // Latest tag + date (for UpdateBanner) — reuse already-resolved date if possible
        if (rawTags.length > 0) {
          const latestTag = rawTags[0];
          const resolvedInBatch = data.tags?.find(t => t.name === latestTag.name);
          const matchingRelease = data.releases?.find(r => r.tag_name === latestTag.name);

          if (resolvedInBatch) {
            data.latestTag = { name: latestTag.name, date: resolvedInBatch.date };
          } else if (matchingRelease) {
            data.latestTag = { name: latestTag.name, date: matchingRelease.published_at };
          } else {
            try {
              const { json: commitData } = await fetchJson(
                `https://api.github.com/repos/${REPO}/commits/${latestTag.commit.sha}`,
                headers,
              );
              data.latestTag = {
                name: latestTag.name,
                date: commitData.commit.author.date,
              };
            } catch {
              data.latestTag = { name: latestTag.name, date: null };
            }
          }
        }
      }

      // Commits — fetch page 1 from the parallel batch, then paginate for more
      const allRawCommits = [];
      if (commitsResult.status === 'fulfilled') {
        allRawCommits.push(...commitsResult.value.json);

        // Fetch up to 7 more pages sequentially
        if (commitsResult.value.json.length >= 30) {
          for (let page = 2; page <= 5; page++) {
            try {
              const { json } = await fetchJson(
                `https://api.github.com/repos/${REPO}/commits?per_page=30&page=${page}`,
                headers,
              );
              if (!Array.isArray(json) || json.length === 0) break;
              allRawCommits.push(...json);
              if (json.length < 30) break;
            } catch {
              break; // keep what we have so far
            }
          }
        }

        data.commits = allRawCommits.map(c => ({
          sha: c.sha,
          message: (c.commit?.message || '').split('\n')[0],
          date: c.commit?.author?.date || c.commit?.committer?.date,
          author_login: c.author?.login || c.commit?.author?.name,
          author_avatar: c.author?.avatar_url,
          html_url: c.html_url,
        }));
      }

      // Contributors — trim to what Authors component needs
      if (contributorsResult.status === 'fulfilled') {
        const allContribs = contributorsResult.value;
        data.contributors = allContribs
          .filter(c => c.type === 'User' && !c.login.endsWith('[bot]'))
          .map(c => ({
            id: c.id,
            login: c.login,
            avatar_url: c.avatar_url,
            html_url: c.html_url,
            contributions: c.contributions,
            type: c.type,
          }));
      }

      // Sponsors
      if (sponsorsResult.status === 'fulfilled') {
        const sponsorsData = sponsorsResult.value.json;
        if (Array.isArray(sponsorsData) && sponsorsData.length > 0) {
          data.sponsors = sponsorsData.map(s => ({
            login: s.login,
            name: s.name,
            avatarUrl: s.avatarUrl,
          }));
        }
      }

      // Star count
      if (repoResult.status === 'fulfilled') {
        data.starCount = repoResult.value.json.stargazers_count || null;
      }

      // Docker pulls
      if (dockerResult.status === 'fulfilled') {
        data.dockerPulls = dockerResult.value.json.pull_count || null;
      }

      // Contributor count from Link header
      if (contributorCountResult.status === 'fulfilled') {
        try {
          const linkHeader = contributorCountResult.value.headers.get('Link');
          if (linkHeader) {
            const lastMatch = linkHeader.match(/&page=(\d+)>;\s*rel="last"/);
            if (lastMatch) {
              data.contributorCount = parseInt(lastMatch[1], 10);
            }
          }
        } catch {}
      }

      const fetched = Object.entries(data)
        .filter(([, v]) => v != null)
        .map(([k, v]) => Array.isArray(v) ? `${k}(${v.length})` : `${k}`)
        .join(', ');
      console.log(`[github-data] Build-time data: ${fetched || 'none (API rate-limited?)'}`);
      return data;
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
