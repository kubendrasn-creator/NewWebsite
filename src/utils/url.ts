// src/utils/url.ts
// Base-aware URL and asset helpers for GitHub Pages deployment.

const RAW_BASE = import.meta.env.BASE_URL || '/NewWebsite';
export const BASE_URL = RAW_BASE.replace(/\/$/, '');

/**
 * Returns a base-aware absolute route path with a trailing slash.
 * E.g., url('/services') => '/NewWebsite/services/'
 *       url('/') => '/NewWebsite/'
 */
export function url(path = ''): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!clean) return `${BASE_URL}/`;
  return `${BASE_URL}/${clean}/`;
}

/**
 * Returns a base-aware path for static assets without a trailing slash.
 * E.g., asset('logo.png') => '/NewWebsite/logo.png'
 */
export function asset(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${BASE_URL}/${clean}`;
}
