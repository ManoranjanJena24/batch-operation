const batches = require("../data/batches");
const ApiError = require("../utils/ApiError");

const VALID_STATUSES = ["Running", "Upcoming", "Completed"];

function getBatches({ page = 1, limit = 5, search = "", status = "", centre = "" }) {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = batches.filter((batch) => {
    const matchesSearch = !normalizedSearch ||
      batch.batchCode.toLowerCase().includes(normalizedSearch) ||
      batch.courseName.toLowerCase().includes(normalizedSearch);
    const matchesStatus = !status || batch.status === status;
    const matchesCentre = !centre || batch.centreName === centre;
    return matchesSearch && matchesStatus && matchesCentre;
  });

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;

  return {
    data: filtered.slice(startIndex, startIndex + limit),
    pagination: {
      page: safePage,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1
    },
    filters: {
      statuses: VALID_STATUSES,
      centres: [...new Set(batches.map((batch) => batch.centreName))].sort()
    }
  };
}

function parseQuery(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 5 : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError(400, "The page query parameter must be a positive integer.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new ApiError(400, "The limit query parameter must be an integer between 1 and 50.");
  }
  const search = typeof query.search === "string" ? query.search : "";
  const status = typeof query.status === "string" ? query.status : "";
  const centre = typeof query.centre === "string" ? query.centre : "";

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}.`);
  }
  if (search.length > 100 || centre.length > 100) {
    throw new ApiError(400, "Search and centre filters must not exceed 100 characters.");
  }
  return { page, limit, search, status, centre };
}

module.exports = { getBatches, parseQuery };
