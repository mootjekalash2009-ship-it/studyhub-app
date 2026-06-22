"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function FilePage() {
  const params = useParams();

  const subject = decodeURIComponent(params.subject as string);
  const folder = decodeURIComponent(params.folder as string);
  const file = decodeURIComponent(params.file as string);

  const editorRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem(`file-${subject}-${folder}-${file}`);
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
    }
  }, [subject, folder, file]);

  // SAVE
  const saveContent = () => {
    if (editorRef.current) {
      localStorage.setItem(
        `file-${subject}-${folder}-${file}`,
        editorRef.current.innerHTML
      );
    }
  };

  // EXEC COMMAND helper
  const cmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveContent();
  };

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
          <Link href="/flashcards"><button className="bg-blue-700 p-4 rounded-xl w-full">Flashcards</button></Link>
          <Link href="/samenvattingen"><button className="bg-blue-700 p-4 rounded-xl w-full">Samenvattingen</button></Link>
          <Link href="/oefenvragen"><button className="bg-blue-700 p-4 rounded-xl w-full">Oefenvragen</button></Link>
          <Link href="/leer-videos"><button className="bg-blue-700 p-4 rounded-xl w-full">Leer video's</button></Link>
        </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 p-10 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📄 {file}</h1>

          <button
            onClick={() => window.print()}
            className="bg-blue-700 px-6 py-2 rounded-xl"
          >
            Download als PDF
          </button>
        </div>

        {/* EDITOR CARD */}
        <div className="bg-white text-black rounded-2xl border-4 border-blue-700 h-[70vh] flex flex-col overflow-hidden">

          {/* TOOLBAR */}
          <div className="flex items-center gap-3 px-3 py-2 border-b bg-gray-100 text-sm">

            {/* zoom */}
            <span className="font-semibold">{zoom}%</span>

            {/* undo/redo */}
            <button onClick={() => cmd("undo")} className="px-2">↶</button>
            <button onClick={() => cmd("redo")} className="px-2">↷</button>

            <div className="w-px h-5 bg-gray-400" />

            {/* font size */}
            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                cmd("fontSize", "3");
                document.execCommand("styleWithCSS", false, "true");
                if (editorRef.current) {
                  editorRef.current.style.fontSize = e.target.value;
                }
              }}
              className="border px-1"
            >
              <option value="14px">10</option>
              <option value="16px">11</option>
              <option value="18px">12</option>
              <option value="22px">14</option>
            </select>

            {/* font family */}
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                cmd("fontName", e.target.value);
              }}
              className="border px-1"
            >
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Verdana</option>
            </select>

            <div className="w-px h-5 bg-gray-400" />

            {/* formatting */}
            <button onClick={() => cmd("bold")} className="font-bold">B</button>
            <button onClick={() => cmd("italic")} className="italic">I</button>
            <button onClick={() => cmd("underline")} className="underline">U</button>

            <div className="w-px h-5 bg-gray-400" />

            {/* zoom */}
            <button onClick={() => setZoom(z => Math.max(50, z - 10))}>-</button>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))}>+</button>
          </div>

          {/* EDITABLE AREA */}
          <div className="flex-1 overflow-auto bg-white">
            <div
              ref={editorRef}
              contentEditable
              onInput={saveContent}
              className="min-h-full p-4 outline-none"
              style={{
                fontFamily,
                fontSize,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
                width: `${100 * (100 / zoom)}%`
              }}
              suppressContentEditableWarning
            />
          </div>
        </div>

      </section>
    </main>
  );
}