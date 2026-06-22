"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Subject = {
  id: string;
  naam: string;
};

export default function FlashcardsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [deleteSubject, setDeleteSubject] =
    useState<Subject | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(
      "studyhub_subjects"
    );

    if (saved) {
      setSubjects(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "studyhub_subjects",
      JSON.stringify(subjects)
    );
  }, [subjects]);

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;

    const exists = subjects.some(
      (s) =>
        s.naam.toLowerCase() ===
        newSubject.trim().toLowerCase()
    );

    if (exists) {
      alert("Dit vak bestaat al.");
      return;
    }

    const updated = [
      ...subjects,
      {
        id: Date.now().toString(),
        naam: newSubject.trim(),
      },
    ];

    setSubjects(updated);
    setNewSubject("");
  };

  const confirmDelete = () => {
    if (!deleteSubject) return;

    const updated = subjects.filter(
      (s) => s.id !== deleteSubject.id
    );

    setSubjects(updated);
    setDeleteSubject(null);
  };

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

      {/* Content */}
      <section className="flex-1 p-10 relative">
        <h2 className="text-4xl font-bold mb-10">
          Flashcard Vakken
        </h2>

        {/* Vak toevoegen */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">
              Vak toevoegen
            </h3>
          </div>

          <div className="p-4">
            <input
              value={newSubject}
              onChange={(e) =>
                setNewSubject(e.target.value)
              }
              placeholder="Bijv. Wiskunde"
              className="w-full p-3 rounded bg-blue-700 mb-3"
            />

            <button
              onClick={addSubject}
              className="w-full bg-blue-800 rounded p-3"
            >
              Voeg vak toe
            </button>
          </div>
        </div>

        {/* Vakken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="relative bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl p-6"
            >
              <button
                onClick={() =>
                  setDeleteSubject(subject)
                }
                className="absolute top-3 right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center font-bold"
              >
                ✕
              </button>

              <Link
                href={`/flashcards/${createSlug(
                  subject.naam
                )}`}
              >
                <div className="cursor-pointer">
                  <h3 className="text-2xl font-bold">
                    📚 {subject.naam}
                  </h3>

                  <p className="text-sm mt-2 opacity-80">
                    Klik om mappen te openen
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="mt-10 text-gray-400">
            Nog geen vakken toegevoegd.
          </div>
        )}
      </section>

      {/* Delete Modal */}
      {deleteSubject && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-[450px] bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
            <div className="p-5 border-b-4 border-[#1700c9]">
              <h3 className="text-2xl font-bold">
                Vak verwijderen
              </h3>
            </div>

            <div className="p-5">
              <p className="mb-6 text-lg">
                Wilt u het vak{" "}
                <strong>
                  {deleteSubject.naam}
                </strong>{" "}
                echt verwijderen?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteSubject(null)
                  }
                  className="flex-1 bg-blue-800 rounded p-3"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 rounded p-3"
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