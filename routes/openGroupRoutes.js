// openGroupRoutes.js
const express = require("express");
const openGroupService = require("../services/openGroupService");
const router = express.Router();

router.get("/join", openGroupService);
module.exports = router;