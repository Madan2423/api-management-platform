const express = require("express");

const {
    generateApiKeyController,
    getApiKeys,
    revokeApiKey
} = require("../controllers/apiKeyController");

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const router = express.Router();


// All API key routes require authentication
router.use(authMiddleware);


// ==========================================
// Generate API Key
// POST /api/keys/:apiId
// ==========================================

router.post(
    "/:apiId",
    generateApiKeyController
);


// ==========================================
// Get API Keys
// GET /api/keys/:apiId
// ==========================================

router.get(
    "/:apiId",
    getApiKeys
);


// ==========================================
// Revoke API Key
// DELETE /api/keys/:apiId/:keyId
// ==========================================

router.delete(
    "/:apiId/:keyId",
    revokeApiKey
);


module.exports = router;