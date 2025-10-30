import { Search, RefreshCw, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  loading,
  onRefresh,
}: Readonly<SearchBarProps>) {
  return (
    <div className="mb-4">
      <div className="max-w-2xl mx-auto mb-4">
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

      {!searchQuery && (
        <div className="flex justify-center">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex text-xs cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r bg-black text-white rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Get New Images
          </button>
        </div>
      )}
    </div>
  );
}