const express = require("express");
const router = express.Router();

router.use("/api/projects", require("./projects"));
router.use("/api/panel", require("./panel"));
router.use("/api/panel/login", require("./login"));
router.use("/api/panel/add", require("./add"));
router.use("/api/panel/delete", require("./delete"));
router.use("/api/panel/modify", require("./modify"));
router.use("/sitemap.xml", require("./sitemap"));
router.use("/og-image", require("./og-image"));

module.exports = router;
