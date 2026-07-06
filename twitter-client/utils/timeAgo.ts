/**
 * Returns a compact relative time string for a given ISO date string.
 * Examples: "5s", "3m", "2h", "4d"
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  // Older than a week — show the actual date
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
