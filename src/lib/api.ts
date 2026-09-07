import axios from 'axios';

// Using a placeholder API key as requested.
// We'll configure this later with actual TMDb credentials.
const TMDB_API_KEY = '34d811fa72407b298591ea2e6ba3cdec';
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Helper for fetching image URLs
export const getImageUrl = (path: string, size: 'w500' | 'w1280' | 'original' = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
