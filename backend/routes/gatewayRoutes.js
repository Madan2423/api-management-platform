const express = require("express");


const {
    gatewayRequest
} = require("../controllers/gatewayController");


const apiKeyMiddleware = require(
    "../middleware/apiKeyMiddleware"
);


const rateLimitMiddleware = require(
    "../middleware/rateLimitMiddleware"
);


const router = express.Router();


// ==========================================
// API Gateway
// ==========================================
//
// Request flow:
//
// Client
//   ↓
// X-API-Key
//   ↓
// API Key Authentication
//   ↓
// Rate Limiting
//   ↓
// Gateway Controller
//   ↓
// Target API
//

router.all(

    "/:apiId",

    apiKeyMiddleware,

    rateLimitMiddleware,

    gatewayRequest

);


module.exports = router;