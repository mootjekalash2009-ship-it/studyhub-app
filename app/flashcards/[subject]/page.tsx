"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Folder = {
  id: string;
  naam: string;
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

const getDB = (): StudyHubDB => {
  if (typeof window === "undefined") return { subjects: [] };

  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : { subjects: [] };
};

const saveDB = (db: StudyHubDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export default function SubjectPage() {
  const params = useParams();
  const subjectName = decodeURIComponent(params.subject as string);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [deleteFolder, setDeleteFolder] = useState<Folder | null>(null);

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    const db = getDB();

    const subject = db.subjects.find(
      (s) => s.name.toLowerCase() === subjectName.toLowerCase()
    );

    if (!subject) {
      setFolders([]);
      return;
    }

    setFolders(
      subject.folders.map((f) => ({
        id: f.id,
        naam: f.name,
      }))
    );
  }, [subjectName]);

  /* =========================
     SAVE
  ========================= */
  useEffect(() => {
    const db = getDB();

    let subject = db.subjects.find(
      (s) => s.name.toLowerCase() === subjectName.toLowerCase()
    );

    // als subject nog niet bestaat → maken
    if (!subject) {
      subject = {
        id: crypto.randomUUID(),
        name: subjectName,
        folders: [],
      };
      db.subjects.push(subject);
    }

    subject.folders = folders.map((f) => ({
      id: f.id,
      name: f.naam,
      cards: [],
    }));

    saveDB(db);
  }, [folders, subjectName]);

  /* =========================
     HELPERS
  ========================= */
  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  /* =========================
     ADD FOLDER
  ========================= */
  const addFolder = () => {
    if (!newFolder.trim()) return;

    const exists = folders.some(
      (f) => f.naam.toLowerCase() === newFolder.toLowerCase()
    );

    if (exists) {
      alert("Deze map bestaat al.");
      return;
    }

    setFolders((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        naam: newFolder.trim(),
      },
    ]);

    setNewFolder("");
  };

  /* =========================
     DELETE FOLDER
  ========================= */
  const confirmDelete = () => {
    if (!deleteFolder) return;

    setFolders((prev) =>
      prev.filter((f) => f.id !== deleteFolder.id)
    );

    setDeleteFolder(null);
  };

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        <Link href="/">
          <div className="h-28 flex items-center justify-center border-b-4 border-[#1700c9]">
            <h1 className="text-3xl font-bold">StudyHub</h1>
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
        {/* HEADER */}
        <Link href="/flashcards">
          <h1 className="text-4xl font-bold cursor-pointer hover:underline">
            📚 {subjectName}
          </h1>
        </Link>

        <p className="text-gray-400 mb-10">
          Beheer hier de hoofdstukken en mappen.
        </p>

        {/* ADD FOLDER */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Map toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Bijv. Hoofdstuk 1"
              className="w-full p-3 rounded bg-blue-700 mb-3"
            />

            <button
              onClick={addFolder}
              className="w-full bg-blue-800 rounded p-3"
            >
              Voeg map toe
            </button>
          </div>
        </div>

        {/* FOLDERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="relative bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl p-6"
            >
              <button
                onClick={() => setDeleteFolder(folder)}
                className="absolute top-3 right-3 w-8 h-8 bg-red-600 rounded-full"
              >
                ✕
              </button>

              <Link
                href={`/flashcards/${subjectName}/${createSlug(
                  folder.naam
                )}`}
              >
                <div>
                  <h3 className="text-2xl font-bold">
                    📁 {folder.naam}
                  </h3>
                  <p className="text-sm opacity-80">
                    Klik om flashcards te openen
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="mt-10 text-gray-400">
            Nog geen mappen toegevoegd.
          </div>
        )}
      </section>

      {/* DELETE MODAL */}
      {deleteFolder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-[450px] bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
            <div className="p-5 border-b-4 border-[#1700c9]">
              <h3 className="text-2xl font-bold">
                Map verwijderen
              </h3>
            </div>

            <div className="p-5">
              <p className="mb-6">
                Wilt u <b>{deleteFolder.naam}</b> echt verwijderen?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteFolder(null)}
                  className="flex-1 bg-blue-800 p-3 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 p-3 rounded"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}