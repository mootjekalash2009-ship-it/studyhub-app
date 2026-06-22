export default function LeerVideosPage() {
  return (
    <main className="min-h-screen flex bg-[#181818] text-white">
      {/* Sidebar */}
      <aside className="w-[330px] bg-[#0054c9] border-r-[12px] border-[#1700c9] flex flex-col">
        <div className="h-[120px] border-b-[12px] border-[#1700c9] flex items-center justify-center">
          <h1 className="text-4xl font-bold">
            StudyHub
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-8">
          <button className="bg-[#0054c9] border-[8px] border-[#1700c9] rounded-[50px] py-8 text-3xl font-bold">
            Flashcards
          </button>

          <button className="bg-[#0054c9] border-[8px] border-[#1700c9] rounded-[50px] py-8 text-3xl font-bold">
            Samenvattingen
          </button>

          <button className="bg-[#0054c9] border-[8px] border-[#1700c9] rounded-[50px] py-8 text-3xl font-bold">
            Oefenvragen
          </button>

          <button className="bg-[#0054c9] border-[8px] border-[#1700c9] rounded-[50px] py-8 text-3xl font-bold">
            Leer video's
          </button>

          <button className="bg-[#0054c9] border-[8px] border-[#1700c9] rounded-[50px] py-8 text-3xl font-bold">
            Leer methodus
          </button>
        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 p-10 relative">
        <h2 className="text-7xl font-bold mb-10">
          Leer video's
        </h2>

        {/* Logo rechtsboven */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#0054c9] border-[8px] border-[#1700c9] rounded-bl-[50px] flex items-center justify-center">
          <h3 className="text-3xl font-bold">
            StudyHub
          </h3>
        </div>

        {/* Video's */}
        <div className="grid grid-cols-2 gap-8 mt-20">
          <div className="bg-[#0054c9] border-[6px] border-[#1700c9] rounded-3xl overflow-hidden">
            <iframe
              className="w-full h-[300px]"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video 1"
              allowFullScreen
            />
          </div>

          <div className="bg-[#0054c9] border-[6px] border-[#1700c9] rounded-3xl overflow-hidden">
            <iframe
              className="w-full h-[300px]"
              src="https://www.youtube.com/embed/jNQXAC9IVRw"
              title="Video 2"
              allowFullScreen
            />
          </div>

          <div className="bg-[#0054c9] border-[6px] border-[#1700c9] rounded-3xl overflow-hidden">
            <iframe
              className="w-full h-[300px]"
              src="https://www.youtube.com/embed/M7lc1UVf-VE"
              title="Video 3"
              allowFullScreen
            />
          </div>

          <div className="bg-[#0054c9] border-[6px] border-[#1700c9] rounded-3xl overflow-hidden">
            <iframe
              className="w-full h-[300px]"
              src="https://www.youtube.com/embed/ysz5S6PUM-U"
              title="Video 4"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}