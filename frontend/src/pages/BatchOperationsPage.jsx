import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import BatchTable from "../components/BatchTable";
import Pagination from "../components/Pagination";
import { fetchBatches } from "../services/api";
import useDebouncedValue from "../hooks/useDebouncedValue";

const PAGE_SIZE = 5;

export default function BatchOperationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [centre, setCentre] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({
    data: [],
    pagination: { page: 1, limit: PAGE_SIZE, totalRecords: 0, totalPages: 0 },
  });
  const [filters, setFilters] = useState({ statuses: [], centres: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim(),
      status,
      centre,
    }),
    [page, debouncedSearch, status, centre],
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");

    fetchBatches(params, controller.signal)
      .then((payload) => {
        if (!active) return;
        setResult({ data: payload.data, pagination: payload.pagination });
        setFilters(payload.filters);
      })
      .catch((requestError) => {
        if (!active || requestError.code === "ERR_CANCELED") return;
        setError(
          requestError.response?.data?.message ||
            "Unable to load batches. Please check your connection and try again.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [params, reloadKey]);

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const updateStatus = (value) => {
    setStatus(value);
    setPage(1);
  };
  const updateCentre = (value) => {
    setCentre(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCentre("");
    setPage(1);
  };
  const hasFilters = Boolean(search || status || centre);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content" id="batch-operations">
        <section className="page-content">
          <div className="page-heading">
            <div>
              <h1>Batch Operations</h1>
            </div>
            <button
              className="create-button"
              type="button"
              title="Batch creation is not part of this assessment"
            >
              <Plus size={17} /> Create Batch
            </button>
          </div>

          <section className="toolbar" aria-label="Batch search and filters">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search by batch code or course name..."
                aria-label="Search by batch code or course name"
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => updateSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <label className="select-wrap">
              <span className="sr-only">Filter by status</span>
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {filters.statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
            <label className="select-wrap">
              <span className="sr-only">Filter by centre</span>
              <select
                value={centre}
                onChange={(e) => updateCentre(e.target.value)}
              >
                <option value="">All Centres</option>
                {filters.centres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
            <button
              className={`filter-button ${hasFilters ? "filter-active" : ""}`}
              onClick={clearFilters}
              title="Clear all filters"
              aria-label="Clear all filters"
            >
              <Filter size={17} />
              {hasFilters && <span className="filter-indicator" />}
            </button>
          </section>

          <section className="table-card">
            {loading ? (
              <div className="state-container" role="status">
                <span className="spinner" />
                <strong>Loading batches</strong>
                <p>Fetching the latest batch records...</p>
              </div>
            ) : error ? (
              <div className="state-container error-state" role="alert">
                <AlertCircle size={27} />
                <strong>Something went wrong</strong>
                <p>{error}</p>
                <button
                  className="retry-button"
                  onClick={() => setReloadKey((current) => current + 1)}
                >
                  Try again
                </button>
              </div>
            ) : result.data.length === 0 ? (
              <div className="state-container">
                <Search size={28} />
                <strong>No batches found</strong>
                <p>Try changing your search term or filters.</p>
                <button className="retry-button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <BatchTable batches={result.data} />
            )}
            {!loading && !error && result.pagination.totalRecords > 0 && (
              <Pagination
                page={result.pagination.page}
                totalPages={result.pagination.totalPages}
                totalRecords={result.pagination.totalRecords}
                limit={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
