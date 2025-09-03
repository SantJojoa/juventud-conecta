const express = require("express");
const router = express.Router();
const { rateEvent, getUserRating } = require("../controllers/ratingController");
const { authMiddleware } = require('../middlewares/authMiddleware'); // tu middleware de auth


router.post("/events/:eventId/rate", authMiddleware, rateEvent);
router.get("/events/:eventId/rate", authMiddleware, getUserRating);


module.exports = router;