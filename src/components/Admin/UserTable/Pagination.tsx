import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  const getPageNumbers = () => {
    const maxPagesToShow = 5
    const pages = []

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const half = Math.floor(maxPagesToShow / 2)
      let start = Math.max(1, currentPage - half)
      const end = Math.min(totalPages, start + maxPagesToShow - 1)

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  if (totalPages <= 0) return null

  return (
    <div className="flex items-center justify-between px-4 py-5 mt-6">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div className="flex gap-1 mx-auto sm:mx-0">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {totalPages > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            1
          </button>
        )}

        {getPageNumbers()[0] > 2 && (
          <span className="relative inline-flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )}

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === pageNum
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
          <span className="relative inline-flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
            ...
          </span>
        )}

        {totalPages > 1 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {totalPages}
          </button>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}