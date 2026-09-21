const bcrypt = require("bcryptjs");

const db = require("../database/database");


const apiKeyMiddleware = async (
    req,
    res,
    next
) => {

    try {

        console.log(
            "================================="
        );

        console.log(
            "API KEY MIDDLEWARE"
        );

        console.log(
            "Request URL:",
            req.originalUrl
        );

        console.log(
            "API ID:",
            req.params.apiId
        );


        // ==========================================
        // Get API Key
        // ==========================================

        const apiKey =
            req.headers["x-api-key"];


        console.log(
            "API Key received:",
            !!apiKey
        );


        if (!apiKey) {

            return res.status(401).json({
                message:
                    "X-API-Key header is required"
            });
        }


        // ==========================================
        // Find API
        // ==========================================

        const api =
            db
                .prepare(`
                    SELECT
                        id,
                        name,
                        base_url
                    FROM apis
                    WHERE id = ?
                `)
                .get(
                    req.params.apiId
                );


        console.log(
            "API found:",
            api
        );


        if (!api) {

            console.log(
                "API NOT FOUND"
            );

            return res.status(404).json({
                message:
                    "API not found"
            });
        }


        // ==========================================
        // Get Active Keys
        // ==========================================

        const apiKeys =
            db
                .prepare(`
                    SELECT
                        id,
                        key_hash,
                        key_prefix,
                        status
                    FROM api_keys
                    WHERE api_id = ?
                    AND status = 'active'
                `)
                .all(
                    req.params.apiId
                );


        console.log(
            "Active API keys:",
            apiKeys.length
        );


        if (apiKeys.length === 0) {

            return res.status(401).json({
                message:
                    "No active API key found"
            });
        }


        // ==========================================
        // Validate API Key
        // ==========================================

        let matchedKey = null;


        for (
            const key of apiKeys
        ) {

            const isMatch =
                await bcrypt.compare(
                    apiKey,
                    key.key_hash
                );


            if (isMatch) {

                matchedKey = key;

                break;
            }
        }


        console.log(
            "API key matched:",
            !!matchedKey
        );


        if (!matchedKey) {

            return res.status(401).json({
                message:
                    "Invalid API key"
            });
        }


        // ==========================================
        // Attach Data
        // ==========================================

        req.api = api;

        req.apiKey = matchedKey;


        console.log(
            "API KEY AUTHENTICATION SUCCESS"
        );


        console.log(
            "================================="
        );


        next();

    } catch (error) {

        console.error(
            "API KEY MIDDLEWARE ERROR:",
            error
        );


        return res.status(500).json({
            message:
                "API key authentication failed"
        });
    }
};


module.exports =
    apiKeyMiddleware;