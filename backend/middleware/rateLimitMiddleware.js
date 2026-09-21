const db = require("../database/database");


const requestCounts = new Map();


const WINDOW_MS =
    60 * 1000;


const MAX_REQUESTS =
    100;


const rateLimitMiddleware = (
    req,
    res,
    next
) => {

    try {

        const apiKey =
            req.headers["x-api-key"];


        if (!apiKey) {

            return res.status(401).json({
                message:
                    "X-API-Key header is required"
            });
        }


        const currentTime =
            Date.now();


        const existingRecord =
            requestCounts.get(apiKey);


        // ==========================================
        // First Request
        // ==========================================

        if (!existingRecord) {

            requestCounts.set(
                apiKey,
                {
                    count: 1,
                    windowStart:
                        currentTime
                }
            );


            res.setHeader(
                "X-RateLimit-Limit",
                MAX_REQUESTS
            );

            res.setHeader(
                "X-RateLimit-Remaining",
                MAX_REQUESTS - 1
            );


            return next();
        }


        const elapsedTime =
            currentTime -
            existingRecord.windowStart;


        // ==========================================
        // Window Expired
        // ==========================================

        if (
            elapsedTime >=
            WINDOW_MS
        ) {

            requestCounts.set(
                apiKey,
                {
                    count: 1,
                    windowStart:
                        currentTime
                }
            );


            res.setHeader(
                "X-RateLimit-Limit",
                MAX_REQUESTS
            );

            res.setHeader(
                "X-RateLimit-Remaining",
                MAX_REQUESTS - 1
            );


            return next();
        }


        // ==========================================
        // Rate Limit Exceeded
        // ==========================================

        if (
            existingRecord.count >=
            MAX_REQUESTS
        ) {

            const retryAfter =
                Math.ceil(
                    (
                        WINDOW_MS -
                        elapsedTime
                    ) / 1000
                );


            // API information is attached
            // by apiKeyMiddleware
            const api =
                req.api;


            const matchedKey =
                req.apiKey;


            // Save rate-limit event
            try {

                if (api) {

                    db
                        .prepare(`
                            INSERT INTO rate_limit_logs (
                                api_id,
                                api_key_id,
                                endpoint,
                                status_code,
                                retry_after
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `)
                        .run(
                            api.id,
                            matchedKey
                                ? matchedKey.id
                                : null,
                            req.query.path || "/",
                            429,
                            retryAfter
                        );
                }

            } catch (
                logError
            ) {

                console.error(
                    "RATE LIMIT LOG ERROR:",
                    logError
                );
            }


            res.setHeader(
                "X-RateLimit-Limit",
                MAX_REQUESTS
            );

            res.setHeader(
                "X-RateLimit-Remaining",
                0
            );

            res.setHeader(
                "Retry-After",
                retryAfter
            );


            return res.status(429).json({

                message:
                    "Rate limit exceeded",

                limit:
                    MAX_REQUESTS,

                window:
                    "1 minute",

                retryAfter:
                    retryAfter

            });
        }


        // ==========================================
        // Increment Request Count
        // ==========================================

        existingRecord.count += 1;


        const remainingRequests =
            MAX_REQUESTS -
            existingRecord.count;


        res.setHeader(
            "X-RateLimit-Limit",
            MAX_REQUESTS
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            remainingRequests
        );


        next();


    } catch (error) {

        console.error(
            "RATE LIMIT ERROR:",
            error
        );


        return res.status(500).json({
            message:
                "Rate limiting error"
        });
    }
};


module.exports =
    rateLimitMiddleware;