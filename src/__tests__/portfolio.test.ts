import { describe, it, expect } from 'vitest';
import { validateGitHubUrl, analyzeRepository } from '@/lib/portfolio';

describe('Portfolio Analyzer & SSRF Protection', () => {
  it('accepts valid GitHub user and repository URLs', () => {
    const userResult = validateGitHubUrl('https://github.com/torvalds');
    expect(userResult.isValid).toBe(true);
    expect(userResult.owner).toBe('torvalds');
    expect(userResult.repo).toBeUndefined();

    const repoResult = validateGitHubUrl('https://github.com/facebook/react');
    expect(repoResult.isValid).toBe(true);
    expect(repoResult.owner).toBe('facebook');
    expect(repoResult.repo).toBe('react');
  });

  it('rejects SSRF attempts targeting localhost, internal IPs, and non-github domains', () => {
    expect(validateGitHubUrl('http://localhost:3000/repo').isValid).toBe(false);
    expect(validateGitHubUrl('http://127.0.0.1:8000').isValid).toBe(false);
    expect(validateGitHubUrl('http://169.254.169.254/latest/meta-data').isValid).toBe(false);
    expect(validateGitHubUrl('https://evil-site.com/github.com/repo').isValid).toBe(false);
  });

  it('rejects malformed inputs and reserved system paths', () => {
    expect(validateGitHubUrl('').isValid).toBe(false);
    expect(validateGitHubUrl('not-a-url').isValid).toBe(false);
    expect(validateGitHubUrl('https://github.com/settings').isValid).toBe(false);
    expect(validateGitHubUrl('https://github.com/explore').isValid).toBe(false);
  });

  it('provides safe fallback analysis when repository or tokens are unconfigured', async () => {
    const output = await analyzeRepository('https://github.com/sample-dev/fastapi-rag');
    expect(output).toBeDefined();
    expect(output.repo_name).toContain('sample-dev/fastapi-rag');
    expect(output.skills.length).toBeGreaterThan(0);
    expect(output.skills[0].verification_level).toBe('Portfolio-Supported');
  });
});
