const express = require("express");
const router = express.Router();
// const auth = require("../../middlewares/authMiddleware");
const { getSpaces } = require("../../controllers/user/spaceController");

router.get("/",getSpaces);

module.exports = router;
