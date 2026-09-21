const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createApi,
    getApis,
    getApiById,
    updateApi,
    deleteApi
} = require("../controllers/apiController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createApi);

router.get("/", getApis);

router.get("/:id", getApiById);

router.put("/:id", updateApi);

router.delete("/:id", deleteApi);

module.exports = router;