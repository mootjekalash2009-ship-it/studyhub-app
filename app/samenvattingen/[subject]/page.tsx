"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Folder = {
  id: string;
  name: string;
  cards: any[];
};

const DB_KEY = "studyhub_db";

type StudyHubDB = {
  subjects: {
    id: string;
    name: string;
    folders: Folder[];
  }[];
};

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

const createSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function SubjectPage() {
  const params = useParams();
  const subject = decodeURIComponent(params.subject as string);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [input, setInput] = useState("");
  const [deleteFolder, setDeleteFolder] = useState<Folder | null>(null);

  useEffect(() => {
    const db = getDB();

    const found = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

    setFolders(found?.folders || []);
  }, [subject]);

  useEffect(() => {
    const db = getDB();

    let subjectData = db.subjects.find(
      (s) => s.name.toLowerCase() === subject.toLowerCase()
    );

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

  const addFolder = () => {
    if (!input.trim()) return;

    setFolders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: input.trim(),
        cards: [],
      },
    ]);

    setInput("");
  };

  const confirmDelete = () => {
    if (!deleteFolder) return;

    setFolders((prev) =>
      prev.filter((f) => f.id !== deleteFolder.id)
    );

    setDeleteFolder(null);
  };

  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9]">
            <div className="text-center">
              <h1 className="text-3xl font-bold">StudyHub</h1>
              <p className="text-xs">Learn. Plan. Succeed.</p>
            </div>
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-4">
          <Link href="/flashcards">
            <button className="w-full bg-blue-700 rounded-xl p-4">
              Flashcards
            </button>
          </Link>

          <Link href="/samenvattingen">
            <button className="w-full bg-blue-700 rounded-xl p-4">
              Samenvattingen
            </button>
          </Link>

          <Link href="/oefenvragen">
            <button className="w-full bg-blue-700 rounded-xl p-4">
              Oefenvragen
            </button>
          </Link>

          <Link href="/leer-videos">
            <button className="w-full bg-blue-700 rounded-xl p-4">
              Leer video's
            </button>
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-10 relative">
        <h2 className="text-3xl font-bold mb-6">
          📚 {subject}
        </h2>

        {/* ADD BOX */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Map toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              className="w-full p-3 bg-blue-700 mb-3 rounded"
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

        {/* FOLDERS → NU ECHT ONDER ELKAAR */}
        <div className="flex flex-col gap-4 max-w-2xl">
          {folders.map((f) => (
            <div
              key={f.id}
              className="relative bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl p-6"
            >
              <button
                onClick={() => setDeleteFolder(f)}
                className="absolute top-3 right-3 w-8 h-8 bg-red-600 rounded-full"
              >
                ✕
              </button>

              <Link
                href={`/samenvattingen/${subject}/${createSlug(f.name)}`}
              >
                <div>
                  <h3 className="text-2xl font-bold">
                    📁 {f.name}
                  </h3>
                  <p className="text-sm opacity-70 mt-2">
                    Klik om map te openen
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {folders.length === 0 && (
          <p className="text-gray-400 mt-10">
            Nog geen mappen toegevoegd.
          </p>
        )}
      </section>

      {/* DELETE MODAL */}
      {deleteFolder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#0054c9] border-4 border-[#1700c9] p-6 rounded-2xl w-[400px]">
            <h3 className="text-xl mb-4">
              Weet je zeker dat je deze map wilt verwijderen?
            </h3>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteFolder(null)}
                className="flex-1 bg-blue-800 p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 p-2 rounded"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}