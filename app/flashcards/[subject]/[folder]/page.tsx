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

/* =========================
   FINAL STORAGE SYSTEM
========================= */

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

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"all" | "known" | "unknown">("all");

  /* =========================
     LOAD FROM DB
  ========================= */

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

  /* =========================
     SAVE TO DB
  ========================= */

  useEffect(() => {
    const db = getDB();

    const subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    if (!subjectData) return;

    const folderData = subjectData.folders.find(
      (f) => f.name.toLowerCase() === folder.toLowerCase()
    );

    if (!folderData) return;

    folderData.cards = cards.map((c) => ({
      id: c.id,
      front: c.begrip,
      back: c.uitleg,
      known: c.known,
    }));

    saveDB(db);
  }, [cards, subject, folder]);

  /* =========================
     FILTER
  ========================= */

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.begrip.toLowerCase().includes(search.toLowerCase()) ||
      c.uitleg.toLowerCase().includes(search.toLowerCase());

    const matchesMode =
      mode === "all"
        ? true
        : mode === "known"
        ? c.known
        : !c.known;

    return matchesSearch && matchesMode;
  });

  const activeCard = filteredCards[current];

  /* =========================
     ACTIONS
  ========================= */

  const addCard = () => {
    if (!begrip.trim() || !uitleg.trim()) return;

    setCards((prev) => [
      ...prev,
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

    setCards((prev) => prev.filter((c) => c.id !== deleteCard.id));
    setDeleteCard(null);
  };

  const saveEdit = () => {
    if (!editCard) return;

    setCards((prev) =>
      prev.map((c) => (c.id === editCard.id ? editCard : c))
    );

    setEditCard(null);
  };

  const markKnown = (value: boolean) => {
    if (!activeCard) return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id ? { ...c, known: value } : c
      )
    );
  };

  const nextCard = () => {
    if (!filteredCards.length) return;
    setCurrent((p) => (p + 1) % filteredCards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    if (!filteredCards.length) return;
    setCurrent((p) =>
      p === 0 ? filteredCards.length - 1 : p - 1
    );
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

  /* =========================
     UI
  ========================= */

  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/flashcards">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9]">
            <h1 className="text-3xl font-bold">StudyHub</h1>
          </div>
        </Link>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-10 relative">
        <Link href={`/flashcards/${subject}`}>
          <h2 className="text-3xl font-bold cursor-pointer hover:underline">
            📁 {folder}
          </h2>
        </Link>

        <p className="text-gray-400 mb-4">{subject}</p>

        <div className="mb-4">📊 Progress: {progress}%</div>

        {/* SEARCH */}
        <div className="flex gap-2 mb-6 pl-4">
          <input
            className="p-2 bg-blue-700 rounded"
            placeholder="Zoeken..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          <button
            onClick={shuffle}
            className="bg-blue-800 px-3 rounded"
          >
            🔀 Shuffle
          </button>
        </div>

        {/* ADD */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Flashcard toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              className="w-full p-2 bg-blue-700 mb-2"
              placeholder="Begrip"
              value={begrip}
              onChange={(e) => setBegrip(e.target.value)}
            />

            <textarea
              className="w-full p-2 bg-blue-700 mb-2"
              placeholder="Uitleg"
              value={uitleg}
              onChange={(e) => setUitleg(e.target.value)}
            />

            <button
              onClick={addCard}
              className="bg-blue-800 w-full p-2 rounded"
            >
              Toevoegen
            </button>
          </div>
        </div>

        {/* FLASHCARD */}
        {activeCard && (
          <div className="flex items-center gap-6">
            <button onClick={prevCard} className="text-5xl">
              ←
            </button>

            <div
              onClick={() => setFlipped(!flipped)}
              className="relative w-72 h-44 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl flex items-center justify-center p-4 text-center cursor-pointer"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCard(activeCard);
                }}
                className="absolute top-2 left-2 text-sm"
              >
                ✏️
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteCard(activeCard);
                }}
                className="absolute top-2 right-2 bg-red-600 w-6 h-6 rounded-full"
              >
                ✕
              </button>

              {!flipped ? (
                <h3 className="text-xl font-bold">
                  {activeCard.begrip}
                </h3>
              ) : (
                <p>{activeCard.uitleg}</p>
              )}

              <div className="absolute bottom-2 flex gap-4 text-sm">
                <button onClick={() => markKnown(true)}>✔</button>
                <button onClick={() => markKnown(false)}>✖</button>
              </div>
            </div>

            <button onClick={nextCard} className="text-5xl">
              →
            </button>
          </div>
        )}

        {/* EDIT */}
        {editCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0054c9] p-4 w-96 rounded">
              <input
                className="w-full p-2 bg-blue-700 mb-2"
                value={editCard.begrip}
                onChange={(e) =>
                  setEditCard({ ...editCard, begrip: e.target.value })
                }
              />

              <textarea
                className="w-full p-2 bg-blue-700 mb-2"
                value={editCard.uitleg}
                onChange={(e) =>
                  setEditCard({ ...editCard, uitleg: e.target.value })
                }
              />

              <button
                onClick={saveEdit}
                className="bg-red-600 w-full p-2"
              >
                Opslaan
              </button>
            </div>
          </div>
        )}

        {/* DELETE */}
        {deleteCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0054c9] p-4 w-96 rounded">
              <p className="mb-4">Verwijderen?</p>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteCard(null)}
                  className="flex-1 bg-gray-700 p-2"
                >
                  Cancel
                </button>

                <button
                  onClick={removeCard}
                  className="flex-1 bg-red-600 p-2"
                >
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