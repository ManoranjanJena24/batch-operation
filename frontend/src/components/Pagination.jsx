import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, totalRecords, limit, onPageChange }) {
  const start = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalRecords);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination-bar">
      <p>Showing <strong>{start}–{end}</strong> of <strong>{totalRecords}</strong> batches</p>
      <nav className="pagination" aria-label="Pagination">
        <button aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /></button>
        {pages.map((number) => (
          <button key={number} aria-current={page === number ? "page" : undefined} className={page === number ? "selected" : ""} onClick={() => onPageChange(number)}>{number}</button>
        ))}
        <button aria-label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}><ChevronRight size={16} /></button>
      </nav>
    </div>
  );
}
