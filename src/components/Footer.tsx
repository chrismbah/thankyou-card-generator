export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md mt-4 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
        <p className="text-lg mb-2 text-sm">How it works:</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
              1
            </span>
            Choose an image
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
              2
            </span>
            Enter your name
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
              3
            </span>
            Customize style
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
              4
            </span>
            Download & share
          </span>
        </div>
      </div>
    </footer>
  );
}