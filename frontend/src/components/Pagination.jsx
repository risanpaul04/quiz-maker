import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  hasPreviousPage = false,
  hasNextPage = false,
  maxButtons = 5,
}) => {
  if (totalPages <= 1) return null;

  // Helper to generate page numbers with ellipsis
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <nav className="flex items-center -space-x-px" aria-label="Pagination">
      <button
        type="button"
        disabled={!hasPreviousPage}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Previous"
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
        <span className="hidden sm:block"> Prev</span>
      </button>

      {pages[0] > 1 && (
        <>
          <button
            type="button"
            className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-hidden focus:bg-gray-100"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            1
          </button>
          <span className="px-2 text-gray-500">...</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-hidden ${
            page === currentPage
              ? 'bg-gray-200 text-gray-800'
              : 'text-gray-800 hover:bg-gray-100'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => page !== currentPage && onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <button
            type="button"
            className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-hidden focus:bg-gray-100"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Next"
        disabled={!hasNextPage}
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
      >
        <span className="hidden sm:block">Next</span>
        <ChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;