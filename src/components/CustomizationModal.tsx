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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Customize Your Card
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Preview</h3>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
              <button
                onClick={onDownload}
                disabled={!userName.trim()}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <Download size={20} />
                Download Card
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Font Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Palette size={18} />
                  Text Color
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-full aspect-square rounded-xl border-4 transition-all duration-300 transform hover:scale-110 ${
                        selectedColor === color.value
                          ? "border-purple-500 scale-110"
                          : "border-gray-200"
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
      </div>
    </div>
  );
}