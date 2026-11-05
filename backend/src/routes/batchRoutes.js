const express = require("express");
const { listBatches } = require("../controllers/batchController");

const router = express.Router();
router.get("/", listBatches);

module.exports = router;
