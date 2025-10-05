// Format number with commas
export const formatNumber = (num) => {
  return num.toLocaleString('en-US');
};

// Truncate text with ellipsis
export const truncate = (str, length = 100) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Format package name for display
export const formatPackageName = (name) => {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Get install command
export const getInstallCommand = (packageName) => {
  return `sudo pacman -S ${packageName}`;
};

// Highlight search term in text
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-green-500/30 text-green-200 px-1 rounded">$1</mark>');
};