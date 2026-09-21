const db = require("../database/database");


const checkApiHealth = async (req, res) => {

    const startTime = Date.now();

    try {

        const { apiId } = req.params;


        // ==========================================
        // Find API and verify ownership
        // ==========================================

        const api = db
            .prepare(`
                SELECT
                    id,
                    name,
                    base_url
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


        // ==========================================
        // Check Target API
        // ==========================================

        const response = await fetch(
            api.base_url,
            {
                method: "GET"
            }
        );


        const responseTime =
            Date.now() - startTime;


        // ==========================================
        // Determine Health Status
        // ==========================================

        const healthy =
            response.ok;


        return res.status(200).json({

            api: {
                id: api.id,
                name: api.name,
                baseUrl: api.base_url
            },

            health: {
                status:
                    healthy
                        ? "healthy"
                        : "unhealthy",

                healthy,

                httpStatus:
                    response.status,

                responseTime,

                checkedAt:
                    new Date().toISOString()
            }

        });


    } catch (error) {

        const responseTime =
            Date.now() - startTime;


        console.error(
            "HEALTH CHECK ERROR:",
            error
        );


        return res.status(200).json({

            api: {
                id: req.params.apiId
            },

            health: {

                status: "unhealthy",

                healthy: false,

                httpStatus: null,

                responseTime,

                error:
                    error.message,

                checkedAt:
                    new Date().toISOString()
            }

        });
    }
};


module.exports = {
    checkApiHealth
};