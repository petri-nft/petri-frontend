export const getHealthColor = (healthIndex: number): string => {
  if (healthIndex >= 90) return 'health-excellent';
  if (healthIndex >= 70) return 'health-good';
  if (healthIndex >= 50) return 'health-medium';
  if (healthIndex >= 30) return 'health-low';
  return 'health-critical';
};

export const getHealthLabel = (healthIndex: number): string => {
  if (healthIndex >= 90) return 'Excellent';
  if (healthIndex >= 70) return 'Good';
  if (healthIndex >= 50) return 'Fair';
  if (healthIndex >= 30) return 'Needs Care';
  return 'Critical';
};

export const getRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
