const express = require("express");
const { seedUser } = require("../controllers/seedController");
const upload = require("../middleware/fileUpload");
const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedUser);

module.exports = seedRouter;
