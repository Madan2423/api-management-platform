const express = require("express");


const authMiddleware =
    require("../middleware/authMiddleware");


const {
    checkApiHealth
} = require("../controllers/healthController");


const router =
    express.Router();


// All health-check routes
// require authentication

router.use(
    authMiddleware
);


// Check API health

router.get(
    "/api/:apiId",
    checkApiHealth
);


module.exports =
    router;