const db = require("../database/database");


const getApiStatistics = (req, res) => {

    try {

        const { apiId } =
            req.params;


        // ==========================================
        // Verify API Ownership
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
                message:
                    "API not found"
            });
        }


        // ==========================================
        // Request Statistics
        // ==========================================

        const statistics = db
            .prepare(`
                SELECT

                    COUNT(*) AS totalRequests,

                    SUM(
                        CASE
                            WHEN status_code >= 200
                            AND status_code < 400
                            THEN 1
                            ELSE 0
                        END
                    ) AS successfulRequests,

                    SUM(
                        CASE
                            WHEN status_code >= 400
                            THEN 1
                            ELSE 0
                        END
                    ) AS failedRequests,

                    AVG(response_time)
                        AS averageResponseTime,

                    MIN(response_time)
                        AS fastestResponseTime,

                    MAX(response_time)
                        AS slowestResponseTime

                FROM request_logs

                WHERE api_id = ?
            `)
            .get(apiId);


        // ==========================================
        // Calculate Success / Failure Rates
        // ==========================================

        const totalRequests =
            Number(
                statistics.totalRequests || 0
            );


        const successfulRequests =
            Number(
                statistics.successfulRequests || 0
            );


        const failedRequests =
            Number(
                statistics.failedRequests || 0
            );


        const successRate =
            totalRequests > 0
                ? (
                    successfulRequests /
                    totalRequests
                ) * 100
                : 0;


        const failureRate =
            totalRequests > 0
                ? (
                    failedRequests /
                    totalRequests
                ) * 100
                : 0;


        // ==========================================
        // Status Code Breakdown
        // ==========================================

        const statusBreakdown =
            db
                .prepare(`
                    SELECT
                        status_code,
                        COUNT(*) AS count
                    FROM request_logs
                    WHERE api_id = ?
                    GROUP BY status_code
                    ORDER BY count DESC
                `)
                .all(apiId);


        // ==========================================
        // HTTP Method Breakdown
        // ==========================================

        const methodBreakdown =
            db
                .prepare(`
                    SELECT
                        method,
                        COUNT(*) AS count
                    FROM request_logs
                    WHERE api_id = ?
                    GROUP BY method
                    ORDER BY count DESC
                `)
                .all(apiId);


        // ==========================================
        // Endpoint Breakdown
        // ==========================================

        const endpointBreakdown =
            db
                .prepare(`
                    SELECT
                        endpoint,
                        COUNT(*) AS count,
                        AVG(response_time)
                            AS averageResponseTime
                    FROM request_logs
                    WHERE api_id = ?
                    GROUP BY endpoint
                    ORDER BY count DESC
                    LIMIT 10
                `)
                .all(apiId);


        // ==========================================
        // Recent Requests
        // ==========================================

        const recentRequests =
            db
                .prepare(`
                    SELECT
                        id,
                        method,
                        endpoint,
                        status_code,
                        response_time,
                        created_at
                    FROM request_logs
                    WHERE api_id = ?
                    ORDER BY created_at DESC
                    LIMIT 20
                `)
                .all(apiId);


        // ==========================================
        // Rate Limit Statistics
        // ==========================================

        const rateLimitStatistics =
            db
                .prepare(`
                    SELECT
                        COUNT(*) AS totalRateLimitViolations
                    FROM rate_limit_logs
                    WHERE api_id = ?
                `)
                .get(apiId);


        // ==========================================
        // Final Response
        // ==========================================

        return res.status(200).json({

            api: {
                id: api.id,
                name: api.name,
                baseUrl: api.base_url
            },


            statistics: {

                totalRequests,

                successfulRequests,

                failedRequests,

                successRate:
                    Number(
                        successRate.toFixed(2)
                    ),

                failureRate:
                    Number(
                        failureRate.toFixed(2)
                    ),

                averageResponseTime:
                    Number(
                        (
                            statistics
                                .averageResponseTime ||
                            0
                        ).toFixed(2)
                    ),

                fastestResponseTime:
                    Number(
                        statistics
                            .fastestResponseTime ||
                        0
                    ),

                slowestResponseTime:
                    Number(
                        statistics
                            .slowestResponseTime ||
                        0
                    ),

                rateLimitViolations:
                    Number(
                        rateLimitStatistics
                            .totalRateLimitViolations ||
                        0
                    )
            },


            statusBreakdown,


            methodBreakdown,


            endpointBreakdown,


            recentRequests

        });


    } catch (error) {

        console.error(
            "MONITORING ERROR:",
            error
        );


        return res.status(500).json({
            message:
                "Server error"
        });
    }
};


module.exports = {
    getApiStatistics
};