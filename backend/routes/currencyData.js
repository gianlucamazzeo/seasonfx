const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create } = require("../controllers/currencyDataUpdate");

// routes
router.post("/currencyData", authCheck, adminCheck, create);

module.exports = router;