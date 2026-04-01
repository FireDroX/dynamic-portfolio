const express = require("express");
const router = express.Router();

router.use("/projects", require("./projects"));
router.use("/panel", require("./panel"));
router.use("/panel/login", require("./login"));
router.use("/panel/add", require("./add"));
router.use("/panel/delete", require("./delete"));
router.use("/panel/modify", require("./modify"));

module.exports = router;
