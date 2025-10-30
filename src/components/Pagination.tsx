interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-6 py-2 bg-white text-xs rounded-full shadow-md disabled:opacity-50 hover:shadow-lg transition-all duration-300"
      >
        Previous
      </button>
      <span className="text-gray-600 font-medium text-xs">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="px-6 py-2 text-xs bg-white rounded-full shadow-md disabled:opacity-50 hover:shadow-lg transition-all duration-300"
      >
        Next
      </button>
    </div>
  );
}