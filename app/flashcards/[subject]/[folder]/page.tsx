"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Flashcard = {
  id: string;
  begrip: string;
  uitleg: string;
  known: boolean;
};

const DB_KEY = "studyhub_db";

type StudyHubDB = {
  subjects: {
    id: string;
    name: string;
    folders: {
      id: string;
      name: string;
      cards: {
        id: string;
        front: string;
        back: string;
        known: boolean;
      }[];
    }[];
  }[];
};

const getDB = (): StudyHubDB => {
  if (typeof window === "undefined") return { subjects: [] };
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : { subjects: [] };
};

const saveDB = (db: StudyHubDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export default function FolderPage() {
  const params = useParams();

  const subject = decodeURIComponent(params.subject as string);
  const folder = decodeURIComponent(params.folder as string);

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [begrip, setBegrip] = useState("");
  const [uitleg, setUitleg] = useState("");

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [deleteCard, setDeleteCard] = useState<Flashcard | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"all" | "known" | "unknown">("all");

  /* LOAD */
  useEffect(() => {
    const db = getDB();

    const subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    const folderData = subjectData?.folders.find(
      (f) => f.name.toLowerCase() === folder.toLowerCase()
    );

    const loaded = folderData?.cards || [];

    setCards(
      loaded.map((c) => ({
        id: c.id,
        begrip: c.front,
        uitleg: c.back,
        known: c.known ?? false,
      }))
    );
  }, [subject, folder]);

  /* SAVE (FIXED) */
  useEffect(() => {
    const db = getDB();

    let subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    if (!subjectData) {
      subjectData = {
        id: crypto.randomUUID(),
        name: subject,
        folders: [],
      };
      db.subjects.push(subjectData);
    }

    let folderData = subjectData.folders.find(
      (f) => f.name.toLowerCase() === folder.toLowerCase()
    );

    if (!folderData) {
      folderData = {
        id: crypto.randomUUID(),
        name: folder,
        cards: [],
      };
      subjectData.folders.push(folderData);
    }

    folderData.cards = cards.map((c) => ({
      id: c.id,
      front: c.begrip,
      back: c.uitleg,
      known: c.known,
    }));

    saveDB(db);
  }, [cards, subject, folder]);

  /* FILTER */
  const filtered = cards.filter((c) => {
    const matchSearch =
      c.begrip.toLowerCase().includes(search.toLowerCase()) ||
      c.uitleg.toLowerCase().includes(search.toLowerCase());

    const matchMode =
      mode === "all"
        ? true
        : mode === "known"
        ? c.known
        : !c.known;

    return matchSearch && matchMode;
  });

  const active = filtered[current];

  /* ACTIONS */
  const addCard = () => {
    if (!begrip || !uitleg) return;

    setCards((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        begrip,
        uitleg,
        known: false,
      },
    ]);

    setBegrip("");
    setUitleg("");
  };

  const removeCard = () => {
    if (!deleteCard) return;
    setCards((p) => p.filter((c) => c.id !== deleteCard.id));
    setDeleteCard(null);
  };

  const deleteAll = () => {
    setCards([]);
    setDeleteAllOpen(false);
  };

  const saveEdit = () => {
    if (!editCard) return;

    setCards((p) =>
      p.map((c) => (c.id === editCard.id ? editCard : c))
    );

    setEditCard(null);
  };

  const markKnown = (v: boolean) => {
    if (!active) return;

    setCards((p) =>
      p.map((c) =>
        c.id === active.id ? { ...c, known: v } : c
      )
    );
  };

  const next = () => {
    if (!filtered.length) return;
    setCurrent((p) => (p + 1) % filtered.length);
    setFlipped(false);
  };

  const prev = () => {
    if (!filtered.length) return;
    setCurrent((p) => (p === 0 ? filtered.length - 1 : p - 1));
    setFlipped(false);
  };

  const shuffle = () => {
    setCards((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });

    setCurrent(0);
    setFlipped(false);
  };

  const progress = useMemo(() => {
    if (!cards.length) return 0;
    return Math.round(
      (cards.filter((c) => c.known).length / cards.length) * 100
    );
  }, [cards]);

  /* UI */
  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9] cursor-pointer">
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                StudyHub
              </h1>
              <p className="text-xs">
                Learn. Plan. Succeed.
              </p>
            </div>
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-4">
          <button className="bg-blue-700 rounded-xl p-4 text-lg">
            Flashcards
          </button>

          <Link href="/samenvattingen">
            <button className="w-full bg-blue-700 rounded-xl p-4 text-lg">
              Samenvattingen
            </button>
          </Link>

          <Link href="/oefenvragen">
            <button className="w-full bg-blue-700 rounded-xl p-4 text-lg">
              Oefenvragen
            </button>
          </Link>

          <Link href="/leer-videos">
            <button className="w-full bg-blue-700 rounded-xl p-4 text-lg">
              Leer video's
            </button>
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-10 relative">

        <h2 className="text-3xl font-bold">📁 {folder}</h2>
        <p className="text-gray-400 mb-4">{subject}</p>

        <div className="mb-4">📊 Progress: {progress}%</div>

        {/* SEARCH + MODE + SHUFFLE */}
        <div className="flex gap-2 mb-6">
          <input
            className="p-2 bg-blue-700 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoeken..."
          />

          <select
            className="bg-blue-700 p-2 rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="all">Alle</option>
            <option value="known">Gekend</option>
            <option value="unknown">Niet gekend</option>
          </select>

          <button onClick={shuffle} className="bg-blue-800 px-3 rounded">
            🔀 Shuffle
          </button>
        </div>

        {/* ADD + DELETE ALL */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">

          <div className="p-4 border-b-4 border-[#1700c9] flex justify-between">
            <h3>Flashcard toevoegen</h3>

            <button
              onClick={() => setDeleteAllOpen(true)}
              className="bg-red-600 px-2 rounded text-sm"
            >
              Verwijder alles
            </button>
          </div>

          <div className="p-4">
            <input
              className="w-full p-2 bg-blue-700 mb-2"
              value={begrip}
              onChange={(e) => setBegrip(e.target.value)}
              placeholder="Begrip"
            />

            <textarea
              className="w-full p-2 bg-blue-700 mb-2"
              value={uitleg}
              onChange={(e) => setUitleg(e.target.value)}
              placeholder="Uitleg"
            />

            <button onClick={addCard} className="bg-blue-800 w-full p-2 rounded">
              Toevoegen
            </button>
          </div>
        </div>

        {/* CARD */}
        {active && (
          <div className="flex items-center gap-6">
            <button onClick={prev} className="text-4xl">←</button>

            <div
              onClick={() => setFlipped(!flipped)}
              className="relative w-72 h-44 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl flex items-center justify-center cursor-pointer"
            >
              <button
                className="absolute top-2 left-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCard(active);
                }}
              >
                ✏️
              </button>

              <button
                className="absolute top-2 right-2 bg-red-600 w-6 h-6 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteCard(active);
                }}
              >
                ✕
              </button>

              {!flipped ? active.begrip : active.uitleg}

              <div className="absolute bottom-2 flex gap-2">
                <button onClick={() => markKnown(true)}>✔</button>
                <button onClick={() => markKnown(false)}>✖</button>
              </div>
            </div>

            <button onClick={next} className="text-4xl">→</button>
          </div>
        )}

        {/* DELETE ALL MODAL */}
        {deleteAllOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0054c9] p-6 w-96 rounded-xl border-4 border-red-600">
              <h3 className="text-xl mb-3">
                Weet je zeker dat je alles wilt verwijderen?
              </h3>

              <p className="text-sm mb-4 text-gray-200">
                Dit kan niet ongedaan worden gemaakt.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteAllOpen(false)}
                  className="flex-1 bg-blue-700 p-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteAll}
                  className="flex-1 bg-red-600 p-2 rounded"
                >
                  Alles verwijderen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0054c9] p-4 w-96">
              <input
                value={editCard.begrip}
                onChange={(e) =>
                  setEditCard({ ...editCard, begrip: e.target.value })
                }
              />

              <textarea
                value={editCard.uitleg}
                onChange={(e) =>
                  setEditCard({ ...editCard, uitleg: e.target.value })
                }
              />

              <button onClick={saveEdit}>Opslaan</button>
            </div>
          </div>
        )}

        {/* DELETE CARD MODAL */}
        {deleteCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0054c9] p-4 w-96">
              <p>Verwijderen?</p>

              <div className="flex gap-2">
                <button onClick={() => setDeleteCard(null)}>
                  Cancel
                </button>

                <button onClick={removeCard}>
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}