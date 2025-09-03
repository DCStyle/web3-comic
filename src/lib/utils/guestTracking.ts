"use client";

// Guest reading limits and tracking

const GUEST_STORAGE_KEY = "guest-comic-sessions";
const GUEST_CHAPTER_LIMIT = 5; // Maximum chapters a guest can read

export interface GuestSession {
  chaptersRead: string[]; // Array of chapter IDs
  lastActivity: number; // Timestamp
  warningShown: boolean; // Whether limit warning was shown
}

export function getGuestSession(): GuestSession {
  if (typeof window === "undefined") {
    return { chaptersRead: [], lastActivity: Date.now(), warningShown: false };
  }

  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored) as GuestSession;
      // Reset session if older than 24 hours
      if (Date.now() - session.lastActivity > 24 * 60 * 60 * 1000) {
        const freshSession = { chaptersRead: [], lastActivity: Date.now(), warningShown: false };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(freshSession));
        return freshSession;
      }
      return session;
    }
  } catch (error) {
    console.error("Error reading guest session:", error);
  }

  // Return default session
  const defaultSession = { chaptersRead: [], lastActivity: Date.now(), warningShown: false };
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultSession));
  return defaultSession;
}

export function updateGuestSession(session: Partial<GuestSession>) {
  if (typeof window === "undefined") return;

  try {
    const current = getGuestSession();
    const updated = {
      ...current,
      ...session,
      lastActivity: Date.now(),
    };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error updating guest session:", error);
  }
}

export function addGuestChapterRead(chapterId: string) {
  const session = getGuestSession();
  if (!session.chaptersRead.includes(chapterId)) {
    updateGuestSession({
      chaptersRead: [...session.chaptersRead, chapterId],
    });
  }
}

export function canGuestReadChapter(): {
  canRead: boolean;
  remaining: number;
  isAtLimit: boolean;
  needsWarning: boolean;
} {
  const session = getGuestSession();
  const chaptersRead = session.chaptersRead.length;
  const remaining = Math.max(0, GUEST_CHAPTER_LIMIT - chaptersRead);
  const isAtLimit = chaptersRead >= GUEST_CHAPTER_LIMIT;
  const needsWarning = chaptersRead >= 3 && !session.warningShown; // Show warning after 3 chapters

  return {
    canRead: !isAtLimit,
    remaining,
    isAtLimit,
    needsWarning,
  };
}

export function markWarningShown() {
  updateGuestSession({ warningShown: true });
}

export function clearGuestSession() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing guest session:", error);
  }
}

export function getGuestStats() {
  const session = getGuestSession();
  const { remaining, isAtLimit } = canGuestReadChapter();
  
  return {
    chaptersRead: session.chaptersRead.length,
    limit: GUEST_CHAPTER_LIMIT,
    remaining,
    isAtLimit,
    percentageUsed: Math.round((session.chaptersRead.length / GUEST_CHAPTER_LIMIT) * 100),
  };
}