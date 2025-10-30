import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { ImageGrid } from "./components/ImageGrid";
import { Pagination } from "./components/Pagination";
import { CustomizationModal } from "./components/CustomizationModal";
import { Footer } from "./components/Footer";
import type { UnsplashImage } from "./types";
import {
  UNSPLASH_ACCESS_KEY,
  IMAGES_PER_PAGE,
  FONTS,
  COLORS,
} from "./constants";

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

  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    fetchRandomImages();
  }, []);

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
      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

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

      ctx.fillStyle = selectedColor;
      ctx.font = `bold 80px ${selectedFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.fillText("Thank You", width / 2, 120);

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
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
          onRefresh={fetchRandomImages}
        />

        <ImageGrid
          images={images}
          loading={loading}
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
        />

        {searchQuery && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}

        <CustomizationModal
          show={showCustomization}
          selectedImage={selectedImage}
          userName={userName}
          setUserName={setUserName}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          canvasRef={canvasRef}
          onClose={() => setShowCustomization(false)}
          onDownload={downloadCard}
        />
      </main>

      <Footer />
    </div>
  );
}
