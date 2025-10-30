import { Check } from "lucide-react";

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

interface ImageGridProps {
  images: UnsplashImage[];
  loading: boolean;
  selectedImage: UnsplashImage | null;
  onImageSelect: (image: UnsplashImage) => void;
}

export function ImageGrid({
  images,
  loading,
  selectedImage,
  onImageSelect,
}: Readonly<ImageGridProps>) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))
          : images.map((image) => (
              <div
                key={image.id}
                onClick={() => onImageSelect(image)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl aspect-[4/5]"
              >
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "Unsplash image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
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
  );
}
