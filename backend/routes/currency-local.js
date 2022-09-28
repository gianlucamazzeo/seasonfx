const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authCheck, adminCheck } = require("../middlewares/auth");
// controller
const {
    readLocal
  } = require("../controllers/currency");

router.get("/currency-local/:id/:fromData/:toData/:granularity", authCheck, readLocal);

module.exports = router