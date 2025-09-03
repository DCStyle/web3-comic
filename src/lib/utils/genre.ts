// Utility functions for handling genres in MySQL (stored as JSON string)

export function parseGenres(genreString: string): string[] {
  try {
    return JSON.parse(genreString);
  } catch {
    // Fallback for older data or malformed JSON
    return genreString.split(',').map(g => g.trim()).filter(Boolean);
  }
}

export function formatGenres(genres: string[]): string {
  return JSON.stringify(genres);
}

export function genreArrayToDisplay(genres: string[]): string {
  return genres.join(', ');
}