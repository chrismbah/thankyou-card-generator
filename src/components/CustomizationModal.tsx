import { X, Download, Palette } from "lucide-react";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    full: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

interface CustomizationModalProps {
  show: boolean;
  selectedImage: UnsplashImage | null;
  userName: string;
  setUserName: (name: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClose: () => void;
  onDownload: () => void;
}

const FONTS = [
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Great Vibes", value: "Great Vibes, cursive" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Dancing Script", value: "Dancing Script, cursive" },
];

const COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Gold", value: "#FFD700" },
  { name: "Rose", value: "#FF6B9D" },
  { name: "Sky", value: "#87CEEB" },
  { name: "Mint", value: "#98FF98" },
];

export function CustomizationModal({
  show,
  selectedImage,
  userName,
  setUserName,
  selectedFont,
  setSelectedFont,
  selectedColor,
  setSelectedColor,
  canvasRef,
  onClose,
  onDownload,
}: CustomizationModalProps) {
  if (!show || !selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Customize Your Card
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview - Left Side */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
              <div className="relative rounded-xl overflow-hidden shadow-lg w-full max-w-xs mx-auto">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
            </div>

            {/* Controls - Right Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Font Style
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`px-3 py-2 text-xs rounded-lg border-2 transition-all ${
                        selectedFont === font.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Palette size={14} />
                  Text Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-full aspect-square rounded-lg border-3 transition-all transform hover:scale-110 ${
                        selectedColor === color.value
                          ? "border-purple-500 scale-110 ring-2 ring-purple-300"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onDownload}
            disabled={!userName.trim()}
            className="w-full flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            <Download size={18} />
            Download Card
          </button>
        </div>
      </div>
    </div>
  );
}
