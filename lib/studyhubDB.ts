const STORAGE_KEY = "studyhub_db";

export type Flashcard = {
  id: string;
  begrip: string;
  uitleg: string;
  known: boolean;
};

export type DB = {
  subjects: Record<
    string,
    {
      folders: Record<
        string,
        {
          cards: Flashcard[];
        }
      >;
    }
  >;
};

const defaultDB: DB = { subjects: {} };

export function loadDB(): DB {
  if (typeof window === "undefined") return defaultDB;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultDB;

  try {
    return JSON.parse(raw);
  } catch {
    return defaultDB;
  }
}

export function saveDB(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function ensureSubject(db: DB, subject: string) {
  if (!db.subjects[subject]) {
    db.subjects[subject] = { folders: {} };
  }
}

export function ensureFolder(db: DB, subject: string, folder: string) {
  ensureSubject(db, subject);

  if (!db.subjects[subject].folders[folder]) {
    db.subjects[subject].folders[folder] = { cards: [] };
  }
}