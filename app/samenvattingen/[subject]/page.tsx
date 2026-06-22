"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Folder = {
  id: string;
  name: string;
};

const DB_KEY = "studyhub_db";

type StudyHubDB = {
  subjects: {
    id: string;
    name: string;
    folders: {
      id: string;
      name: string;
      cards: any[];
    }[];
  }[];
};

// 🔒 SAFE DB LOADER
const getDB = (): StudyHubDB => {
  if (typeof window === "undefined") return { subjects: [] };

  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : { subjects: [] };
  } catch {
    return { subjects: [] };
  }
};

const saveDB = (db: StudyHubDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// 🔥 SLUG
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export default function SubjectPage() {
  const params = useParams();
  const subject = decodeURIComponent(params.subject as string);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [input, setInput] = useState("");

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const db = getDB();

    const found = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    if (found) {
      setFolders(found.folders || []);
    } else {
      setFolders([]);
    }
  }, [subject]);

  // =========================
  // SAVE DATA (SAFE FIXED)
  // =========================
  useEffect(() => {
    const db = getDB();

    let subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    // 🔥 FIX: ALWAYS CREATE IF MISSING
    if (!subjectData) {
      subjectData = {
        id: Date.now().toString(),
        name: subject,
        folders: [],
      };

      db.subjects.push(subjectData);
    }

    subjectData.folders = folders;

    saveDB(db);
  }, [folders, subject]);

  // =========================
  // ADD FOLDER
  // =========================
  const addFolder = () => {
    if (!input.trim()) return;

    setFolders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: input.trim(),
      },
    ]);

    setInput("");
  };

  // =========================
  // UI
  // =========================
  return (
    <main className="min-h-screen flex bg-[#181818] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9] cursor-pointer">
            <div className="text-center">
              <h1 className="text-3xl font-bold">StudyHub</h1>
              <p className="text-xs">Learn. Plan. Succeed.</p>
            </div>
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-4">
          <Link href="/flashcards">
            <button className="bg-blue-700 rounded-xl p-4 text-lg w-full">
              Flashcards
            </button>
          </Link>

          <Link href="/samenvattingen">
            <button className="bg-blue-700 rounded-xl p-4 text-lg w-full">
              Samenvattingen
            </button>
          </Link>

          <Link href="/oefenvragen">
            <button className="bg-blue-700 rounded-xl p-4 text-lg w-full">
              Oefenvragen
            </button>
          </Link>

          <Link href="/leer-videos">
            <button className="bg-blue-700 rounded-xl p-4 text-lg w-full">
              Leer video's
            </button>
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-10 relative">

        {/* BACK */}
        <Link href="/samenvattingen">
          <h2 className="text-3xl font-bold mb-6 cursor-pointer hover:underline">
            📚 {subject}
          </h2>
        </Link>

        {/* ADD BOX */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Map toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              className="w-full p-3 bg-blue-700 mb-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hoofdstuk 1"
            />

            <button
              onClick={addFolder}
              className="w-full bg-blue-800 p-3 rounded"
            >
              Toevoegen
            </button>
          </div>
        </div>

        {/* FOLDERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {folders.map((f) => (
            <Link
              key={f.id}
              href={`/samenvattingen/${subject}/${createSlug(f.name)}`}
            >
              <div className="bg-[#0054c9] border-4 border-[#1700c9] p-6 rounded-2xl cursor-pointer">
                📁 {f.name}
              </div>
            </Link>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="mt-10 text-gray-400">
            Nog geen mappen toegevoegd.
          </div>
        )}

      </section>
    </main>
  );
}