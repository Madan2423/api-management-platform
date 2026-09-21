const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const db = require("../database/database");


const generateApiKey = () => {
    return "amp_" + crypto.randomBytes(32).toString("hex");
};


const generateApiKeyController = async (req, res) => {
    try {
        const { apiId } = req.params;

        // Check whether API belongs to logged-in user
        const api = db
            .prepare(`
                SELECT id, name
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(
                apiId,
                req.user.userId
            );

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        // Generate secure API key
        const apiKey = generateApiKey();

        // Hash API key before storing
        const keyHash = await bcrypt.hash(
            apiKey,
            10
        );

        // Store only a safe prefix
        const keyPrefix = apiKey.substring(0, 12);

        // Save API key
        const result = db
            .prepare(`
                INSERT INTO api_keys (
                    api_id,
                    key_hash,
                    key_prefix,
                    status
                )
                VALUES (?, ?, ?, 'active')
            `)
            .run(
                apiId,
                keyHash,
                keyPrefix
            );

        res.status(201).json({
            message: "API key generated successfully",

            apiKey: apiKey,

            apiKeyId: result.lastInsertRowid,

            warning: "Save this API key now. It will not be shown again."
        });

    } catch (error) {
        console.error(
            "GENERATE API KEY ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getApiKeys = (req, res) => {
    try {
        const { apiId } = req.params;

        // Check API ownership
        const api = db
            .prepare(`
                SELECT id
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(
                apiId,
                req.user.userId
            );

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        const apiKeys = db
            .prepare(`
                SELECT
                    id,
                    key_prefix,
                    status,
                    created_at
                FROM api_keys
                WHERE api_id = ?
                ORDER BY created_at DESC
            `)
            .all(apiId);

        res.status(200).json({
            count: apiKeys.length,
            apiKeys
        });

    } catch (error) {
        console.error(
            "GET API KEYS ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


const revokeApiKey = (req, res) => {
    try {
        const {
            apiId,
            keyId
        } = req.params;

        // Check API ownership
        const api = db
            .prepare(`
                SELECT id
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(
                apiId,
                req.user.userId
            );

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        // Check key
        const apiKey = db
            .prepare(`
                SELECT id
                FROM api_keys
                WHERE id = ?
                AND api_id = ?
            `)
            .get(
                keyId,
                apiId
            );

        if (!apiKey) {
            return res.status(404).json({
                message: "API key not found"
            });
        }

        // Revoke key
        db
            .prepare(`
                UPDATE api_keys
                SET status = 'revoked'
                WHERE id = ?
                AND api_id = ?
            `)
            .run(
                keyId,
                apiId
            );

        res.status(200).json({
            message: "API key revoked successfully"
        });

    } catch (error) {
        console.error(
            "REVOKE API KEY ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    generateApiKeyController,
    getApiKeys,
    revokeApiKey
};