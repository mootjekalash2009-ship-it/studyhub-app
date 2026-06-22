"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadDB, saveDB, ensureFolder } from "@/lib/studyhubDB";

type FileDoc = {
  id: string;
  name: string;
  content: string;
};

export default function FolderPage() {
  const params = useParams();

  const subject = decodeURIComponent(params.subject as string);
  const folder = decodeURIComponent(params.folder as string);

  const [files, setFiles] = useState<FileDoc[]>([]);
  const [fileName, setFileName] = useState("");

  // 📥 LOAD
  useEffect(() => {
    const db = loadDB();

    ensureFolder(db, subject, folder);

    const folderData =
      db.subjects?.[subject]?.folders?.[folder];

    if (!folderData) {
      setFiles([]);
      return;
    }

    const mappedFiles: FileDoc[] = folderData.cards.map((c) => ({
      id: c.id,
      name: c.begrip,
      content: c.uitleg,
    }));

    setFiles(mappedFiles);
  }, [subject, folder]);

  // 💾 SAVE
  useEffect(() => {
    const db = loadDB();

    ensureFolder(db, subject, folder);

    const subjectData = db.subjects[subject];
    const folderData = subjectData.folders[folder];

    folderData.cards = files.map((f) => ({
      id: f.id,
      begrip: f.name,
      uitleg: f.content,
      known: false,
    }));

    saveDB(db);
  }, [files, subject, folder]);

  // ➕ NEW FILE
  const addFile = () => {
    if (!fileName.trim()) return;

    const newFile: FileDoc = {
      id: Date.now().toString(),
      name: fileName.trim().endsWith(".txt")
        ? fileName.trim()
        : `${fileName.trim()}.txt`,
      content: "",
    };

    setFiles((prev) => [...prev, newFile]);
    setFileName("");
  };

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

      {/* CONTENT */}
      <section className="flex-1 p-10 relative">
        {/* BACK */}
        <Link href={`/samenvattingen/${subject}`}>
          <h2 className="text-4xl font-bold mb-10 cursor-pointer hover:underline">
            📁 {folder}
          </h2>
        </Link>

        {/* NEW FILE BOX */}
        <div className="absolute top-6 right-6 w-96 bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl">
          <div className="p-4 border-b-4 border-[#1700c9]">
            <h3 className="text-2xl font-bold">Nieuw bestand</h3>
          </div>

          <div className="p-4">
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Bestandsnaam"
              className="w-full p-3 rounded bg-blue-700 mb-3"
            />

            <button
              onClick={addFile}
              className="w-full bg-blue-800 rounded p-3"
            >
              Bestand maken
            </button>
          </div>
        </div>

        {/* FILE LIST */}
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          {files.map((file) => (
            <Link
              key={file.id}
              href={`/samenvattingen/${subject}/${folder}/${file.id}`}
            >
              <div className="bg-[#0054c9] border-4 border-[#1700c9] rounded-2xl p-6 cursor-pointer hover:opacity-80 transition">
                <h3 className="text-xl font-bold">
                  📄 {file.name}
                </h3>

                <p className="text-sm opacity-70 mt-2">
                  Klik om te openen
                </p>
              </div>
            </Link>
          ))}
        </div>

        {files.length === 0 && (
          <div className="mt-10 text-gray-400">
            Nog geen bestanden in deze map.
          </div>
        )}
      </section>
    </main>
  );
}