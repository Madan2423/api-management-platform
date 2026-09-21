const express = require("express");

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    getApiStatistics
} = require(
    "../controllers/monitoringController"
);

const router = express.Router();


// All monitoring routes require JWT
router.use(authMiddleware);


// API statistics
router.get(
    "/api/:apiId",
    getApiStatistics
);


module.exports = router;