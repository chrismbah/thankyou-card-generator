import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Download, RefreshCw, X, Check, Palette } from "lucide-react";

const UNSPLASH_ACCESS_KEY = "4dSjVxLwEayiFOP_5jL_BedLgFTTNFBZ367j9-mmj3k";
const IMAGES_PER_PAGE = 4;

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

export default function ThankYouCardGenerator() {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [showCustomization, setShowCustomization] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  // Fetch random images on mount
  useEffect(() => {
    fetchRandomImages();
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchImages(searchQuery, 1);
      }, 500);
    } else {
      fetchRandomImages();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=${IMAGES_PER_PAGE}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setImages(data);
      setPage(1);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching random images:", error);
    }
    setLoading(false);
  };

  const searchImages = async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${pageNum}&per_page=${IMAGES_PER_PAGE}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setImages(data.results);
      setTotalPages(Math.ceil(data.total / IMAGES_PER_PAGE));
      setPage(pageNum);
    } catch (error) {
      console.error("Error searching images:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (searchQuery.trim()) {
      searchImages(searchQuery, newPage);
    }
  };

  const handleImageSelect = (image: UnsplashImage) => {
    setSelectedImage(image);
    setShowCustomization(true);
  };

  const generateCard = useCallback(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Set canvas dimensions with 4:5 aspect ratio
      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Add semi-transparent overlays for text
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 200);
      gradient1.addColorStop(0, "rgba(0, 0, 0, 0.5)");
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, 200);

      const gradient2 = ctx.createLinearGradient(0, height - 200, 0, height);
      gradient2.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, height - 200, width, 200);

      // Draw "Thank You" text at top
      ctx.fillStyle = selectedColor;
      ctx.font = `bold 80px ${selectedFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.fillText("Thank You", width / 2, 120);

      // Draw user name at bottom
      if (userName.trim()) {
        ctx.font = `60px ${selectedFont}`;
        ctx.fillText(userName, width / 2, height - 120);
      }
    };

    img.src = selectedImage.urls.full;
  }, [selectedImage, userName, selectedFont, selectedColor]);

  useEffect(() => {
    if (selectedImage) {
      generateCard();
    }
  }, [selectedImage, userName, selectedFont, selectedColor, generateCard]);

  const downloadCard = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `thank-you-card-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-black text-center">
            Thank You Card Generator
          </h1>
          <p className="text-gray-600 text-center text-xs">
            Create beautiful personalized cards in seconds
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for images (nature, celebration, flowers...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-xs placeholder:text-xs rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        {!searchQuery && (
          <div className="flex justify-center mb-4">
            <button
              onClick={fetchRandomImages}
              disabled={loading}
              className="flex text-xs cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r bg-black text-white rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Get New Images
            </button>
          </div>
        )}

        {/* Image Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))
              : images.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageSelect(image)}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl aspect-[4/5]"
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || "Unsplash image"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm">by {image.user.name}</p>
                    </div>
                    {selectedImage?.id === image.id && (
                      <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                        <Check size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>

        {/* Pagination */}
        {searchQuery && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-6 py-2 bg-white text-xs rounded-full shadow-md disabled:opacity-50 hover:shadow-lg transition-all duration-300"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="px-6 py-2 text-xs bg-white rounded-full shadow-md disabled:opacity-50 hover:shadow-lg transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {/* Customization Panel */}
        {showCustomization && selectedImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Customize Your Card
                  </h2>
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Preview */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">
                      Preview
                    </h3>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto"
                        style={{ aspectRatio: "4/5" }}
                      />
                    </div>
                    <button
                      onClick={downloadCard}
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
        )}
      </main>

      {/* Instructions Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-4 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p className="text-lg mb-2 text-sm">How it works:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2 ">
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
    </div>
  );
}
