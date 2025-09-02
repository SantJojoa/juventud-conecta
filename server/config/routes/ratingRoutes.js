const express = require("express");
const router = express.Router();
const { rateEvent } = require("../controllers/ratingController");

router.post("/events/:eventId/rate", rateEvent);

module.exports = router;