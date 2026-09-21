const db = require("../database/database");

const createApi = (req, res) => {
    try {
        const { name, base_url, description } = req.body;

        if (!name || !base_url) {
            return res.status(400).json({
                message: "API name and base URL are required"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO apis (
                    user_id,
                    name,
                    base_url,
                    description
                )
                VALUES (?, ?, ?, ?)
            `)
            .run(
                req.user.userId,
                name,
                base_url,
                description || null
            );

        const api = db
            .prepare(`
                SELECT
                    id,
                    user_id,
                    name,
                    base_url,
                    description,
                    created_at
                FROM apis
                WHERE id = ?
            `)
            .get(result.lastInsertRowid);

        res.status(201).json({
            message: "API created successfully",
            api
        });

    } catch (error) {
        console.error("CREATE API ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getApis = (req, res) => {
    try {
        const apis = db
            .prepare(`
                SELECT
                    id,
                    name,
                    base_url,
                    description,
                    created_at
                FROM apis
                WHERE user_id = ?
                ORDER BY created_at DESC
            `)
            .all(req.user.userId);

        res.status(200).json({
            count: apis.length,
            apis
        });

    } catch (error) {
        console.error("GET APIS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getApiById = (req, res) => {
    try {
        const { id } = req.params;

        const api = db
            .prepare(`
                SELECT
                    id,
                    name,
                    base_url,
                    description,
                    created_at
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(id, req.user.userId);

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        res.status(200).json({
            api
        });

    } catch (error) {
        console.error("GET API ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateApi = (req, res) => {
    try {
        const { id } = req.params;
        const { name, base_url, description } = req.body;

        if (!name || !base_url) {
            return res.status(400).json({
                message: "API name and base URL are required"
            });
        }

        const existingApi = db
            .prepare(`
                SELECT id
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(id, req.user.userId);

        if (!existingApi) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        db
            .prepare(`
                UPDATE apis
                SET
                    name = ?,
                    base_url = ?,
                    description = ?
                WHERE id = ?
                AND user_id = ?
            `)
            .run(
                name,
                base_url,
                description || null,
                id,
                req.user.userId
            );

        const updatedApi = db
            .prepare(`
                SELECT
                    id,
                    name,
                    base_url,
                    description,
                    created_at
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(id, req.user.userId);

        res.status(200).json({
            message: "API updated successfully",
            api: updatedApi
        });

    } catch (error) {
        console.error("UPDATE API ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteApi = (req, res) => {
    try {
        const { id } = req.params;

        const existingApi = db
            .prepare(`
                SELECT id
                FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .get(id, req.user.userId);

        if (!existingApi) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        db
            .prepare(`
                DELETE FROM apis
                WHERE id = ?
                AND user_id = ?
            `)
            .run(id, req.user.userId);

        res.status(200).json({
            message: "API deleted successfully"
        });

    } catch (error) {
        console.error("DELETE API ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createApi,
    getApis,
    getApiById,
    updateApi,
    deleteApi
};