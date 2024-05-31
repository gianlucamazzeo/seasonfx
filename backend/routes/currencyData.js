const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, all, getMostRecentDate, createH4 } = require("../controllers/currencyDataUpdate");

// routes
router.post("/currencyData", authCheck, adminCheck, create);
router.post("/currencyDataH4", authCheck, adminCheck, createH4);

router.get("/currencyDataPair", authCheck, all);


// router.get("/pair/:currency", listAll);

module.exports = router;