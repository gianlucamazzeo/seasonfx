const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authCheck, adminCheck } = require("../middlewares/auth");
// controller
const {
    dataDay
  } = require("../controllers/currency");

router.get("/day-currency/:id/:fromData/:toData/:granularity", authCheck, dataDay);

module.exports = router