const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authCheck, adminCheck } = require("../middlewares/auth");
// controller
const {
    readCurrentLocal
  } = require("../controllers/currency");

router.get("/currency-current-local/:id/:fromData/:toData/:granularity", authCheck, readCurrentLocal);

module.exports = router