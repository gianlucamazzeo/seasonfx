const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, all, getMostRecentDate } = require("../controllers/currencyDataUpdate");

// routes
router.post("/currencyData", authCheck, adminCheck, create);

router.get("/currencyDataPair", authCheck, all);


// router.get("/pair/:currency", listAll);

module.exports = router;