"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0054c9] border-r-4 border-[#1700c9] flex flex-col">
        
        {/* Logo */}
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

        {/* Menu */}
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

      {/* Home content */}
      <section className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-4">
            Welkom bij StudyHub
          </h2>

          <p className="text-gray-400 text-xl">
            Kies een onderdeel uit het menu.
          </p>
        </div>
      </section>
    </main>
  );
}