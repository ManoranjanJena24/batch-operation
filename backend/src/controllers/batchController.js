const { getBatches, parseQuery } = require("../services/batchService");

function listBatches(req, res) {
  const query = parseQuery(req.query);
  const result = getBatches(query);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: result.filters
  });
}

module.exports = { listBatches };
