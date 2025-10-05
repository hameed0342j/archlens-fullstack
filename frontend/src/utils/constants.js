// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pagination
export const DEFAULT_PAGE_SIZE = 30;
export const MAX_PAGE_SIZE = 100;

// Debounce delays
export const SEARCH_DEBOUNCE_MS = 500;

// Cache times (in milliseconds)
export const CACHE_TIME_CATEGORIES = 5 * 60 * 1000; // 5 minutes
export const CACHE_TIME_PACKAGES = 2 * 60 * 1000;   // 2 minutes
export const CACHE_TIME_SEARCH = 1 * 60 * 1000;     // 1 minute

// Toast durations
export const TOAST_DURATION_MS = 4000;

// Keyboard shortcuts
export const SHORTCUTS = {
  SEARCH: ['cmd+k', 'ctrl+k'],
  ESCAPE: ['escape'],
  HELP: ['cmd+/', 'ctrl+/'],
};

// App metadata
export const APP_NAME = 'ArchLens';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Demystifying Your Arch Linux System';