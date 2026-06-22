"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Subject = {
  id: string;
  naam: string;
};

export default function SamenvattingenPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("samenvattingen_subjects");
    if (saved) setSubjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "samenvattingen_subjects",
      JSON.stringify(subjects)
    );
  }, [subjects]);

  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const addSubject = () => {
    if (!newSubject.trim()) return;

    const exists = subjects.some(
      (s) => s.naam.toLowerCase() === newSubject.toLowerCase()
    );

    if (exists) return alert("Dit vak bestaat al.");

    setSubjects([
      ...subjects,
      { id: Date.now().toString(), naam: newSubject.trim() },
    ]);

    setNewSubject("");
  };

  const confirmDelete = () => {
    if (!deleteSubject) return;

    setSubjects(subjects.filter((s) => s.id !== deleteSubject.id));
    setDeleteSubject(null);
  };

  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* Sidebar */}
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
            <button className="w-full bg-blue-700 rounded-xl p-4 text-lg">
              Flashcards
            </button>
          </Link>

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

      {/* Content */}
      <section className="flex-1 p-10 relative">
        <h2 className="text-4xl font-bold mb-10">
          Samenvattingen vakken
        </h2>

        {/* Add */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Vak toevoegen</h3>
          </div>

          <div className="p-4">
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full p-3 rounded bg-blue-700 mb-3"
              placeholder="Bijv. Biologie"
            />

            <button
              onClick={addSubject}
              className="w-full bg-blue-800 rounded p-3"
            >
              Toevoegen
            </button>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="relative bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl p-6"
            >
              <button
                onClick={() => setDeleteSubject(s)}
                className="absolute top-3 right-3 w-8 h-8 bg-red-600 rounded-full"
              >
                ✕
              </button>

              <Link href={`/samenvattingen/${createSlug(s.naam)}`}>
                <div className="cursor-pointer">
                  <h3 className="text-2xl font-bold">📘 {s.naam}</h3>
                  <p className="text-sm mt-2 opacity-80">
                    Klik om mappen te openen
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty */}
        {subjects.length === 0 && (
          <div className="mt-10 text-gray-400">
            Nog geen vakken toegevoegd.
          </div>
        )}
      </section>

      {/* Delete modal */}
      {deleteSubject && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#0054c9] border-4 border-[#1700c9] p-6 rounded-2xl w-[400px]">
            <h3 className="text-xl mb-4">Weet je het zeker?</h3>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteSubject(null)}
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