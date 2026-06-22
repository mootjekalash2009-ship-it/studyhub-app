"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Card = {
  id: string;
  front: string;
  back: string;
};

const DB_KEY = "studyhub_db";

type StudyHubDB = {
  subjects: {
    id: string;
    name: string;
    folders: {
      id: string;
      name: string;
      cards: Card[];
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

  const [cards, setCards] = useState<Card[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    const db = getDB();

    const subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    const folderData = subjectData?.folders.find(
      (f) => f.name.toLowerCase() === folder.toLowerCase()
    );

    setCards(folderData?.cards || []);
  }, [subject, folder]);

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

    folderData.cards = cards;
    saveDB(db);
  }, [cards, subject, folder]);

  const addCard = () => {
    if (!front || !back) return;

    setCards((prev) => [
      ...prev,
      { id: Date.now().toString(), front, back },
    ]);

    setFront("");
    setBack("");
  };

  return (
    <main className="min-h-screen flex bg-[#181818] text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9] cursor-pointer">
            <h1 className="text-3xl font-bold">StudyHub</h1>
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-4">
          <Link href="/flashcards">
            <button className="bg-blue-700 rounded-xl p-4 w-full">Flashcards</button>
          </Link>

          <Link href="/samenvattingen">
            <button className="bg-blue-700 rounded-xl p-4 w-full">Samenvattingen</button>
          </Link>

          <Link href="/oefenvragen">
            <button className="bg-blue-700 rounded-xl p-4 w-full">Oefenvragen</button>
          </Link>

          <Link href="/leer-videos">
            <button className="bg-blue-700 rounded-xl p-4 w-full">Leer video's</button>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 p-10 relative">

        {/* BACK */}
        <Link href={`/samenvattingen/${subject}`}>
          <h2 className="text-3xl font-bold mb-6 hover:underline cursor-pointer">
            📁 {folder}
          </h2>
        </Link>

        {/* ADD */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4">
            <h3 className="text-2xl font-bold">Samenvatting toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              className="w-full p-3 bg-blue-700 mb-2"
              placeholder="Titel"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />

            <textarea
              className="w-full p-3 bg-blue-700 mb-2"
              placeholder="Uitleg"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />

            <button
              onClick={addCard}
              className="w-full bg-blue-800 p-3 rounded"
            >
              Toevoegen
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid gap-4 max-w-3xl">
          {cards.map((c) => (
            <div
              key={c.id}
              className="bg-[#0054c9] border-4 border-[#1700c9] p-4 rounded-2xl"
            >
              <h3 className="font-bold">{c.front}</h3>
              <p className="text-sm opacity-80 mt-2">{c.back}</p>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}