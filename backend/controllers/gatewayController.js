const db = require("../database/database");


const gatewayRequest = async (
    req,
    res
) => {

    const startTime =
        Date.now();


    try {

        const { apiId } =
            req.params;


        // ==========================================
        // API information comes from middleware
        // ==========================================

        const api =
            req.api;


        if (!api) {

            return res.status(404).json({
                message:
                    "API not found"
            });
        }


        // ==========================================
        // API Key information
        // ==========================================

        const apiKey =
            req.apiKey;


        if (!apiKey) {

            return res.status(401).json({
                message:
                    "API key authentication required"
            });
        }


        // ==========================================
        // Target Path
        // ==========================================

        let targetPath =
            req.query.path || "/";


        if (
            !targetPath.startsWith("/")
        ) {

            targetPath =
                `/${targetPath}`;
        }


        // ==========================================
        // Build Target URL
        // ==========================================

        const baseUrl =
            api.base_url.endsWith("/")
                ? api.base_url
                : `${api.base_url}/`;


        const targetUrl =
            new URL(
                targetPath,
                baseUrl
            );


        // ==========================================
        // Forward Query Parameters
        // ==========================================

        Object.entries(
            req.query
        ).forEach(
            ([key, value]) => {

                if (
                    key !== "path"
                ) {

                    targetUrl.searchParams.append(
                        key,
                        value
                    );
                }

            }
        );


        // ==========================================
        // HTTP Method
        // ==========================================

        const method =
            req.method;


        // ==========================================
        // Request Options
        // ==========================================

        const fetchOptions = {

            method: method,

            headers: {
                "Content-Type":
                    "application/json"
            }

        };


        // ==========================================
        // Forward Request Body
        // ==========================================

        if (
            method !== "GET" &&
            method !== "HEAD" &&
            method !== "DELETE"
        ) {

            if (
                Object.keys(
                    req.body || {}
                ).length > 0
            ) {

                fetchOptions.body =
                    JSON.stringify(
                        req.body
                    );
            }
        }


        // ==========================================
        // Call Target API
        // ==========================================

        const targetResponse =
            await fetch(
                targetUrl.toString(),
                fetchOptions
            );


        const responseTime =
            Date.now() -
            startTime;


        // ==========================================
        // Read Response
        // ==========================================

        const contentType =
            targetResponse.headers.get(
                "content-type"
            ) || "";


        let responseData;


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            responseData =
                await targetResponse.json();

        } else {

            responseData =
                await targetResponse.text();
        }


        // ==========================================
        // Save Request Log
        // ==========================================

        db
            .prepare(`
                INSERT INTO request_logs (
                    api_id,
                    method,
                    endpoint,
                    status_code,
                    response_time
                )
                VALUES (?, ?, ?, ?, ?)
            `)
            .run(
                api.id,
                method,
                targetPath,
                targetResponse.status,
                responseTime
            );


        // ==========================================
        // Return Target API Response
        // ==========================================

        if (
            contentType.includes(
                "application/json"
            )
        ) {

            return res
                .status(
                    targetResponse.status
                )
                .json(
                    responseData
                );
        }


        return res
            .status(
                targetResponse.status
            )
            .json({
                data: responseData
            });


    } catch (error) {

        const responseTime =
            Date.now() -
            startTime;


        console.error(
            "GATEWAY ERROR:",
            error
        );


        // ==========================================
        // Save Failed Request Log
        // ==========================================

        try {

            const apiId =
                req.params.apiId;


            db
                .prepare(`
                    INSERT INTO request_logs (
                        api_id,
                        method,
                        endpoint,
                        status_code,
                        response_time
                    )
                    VALUES (?, ?, ?, ?, ?)
                `)
                .run(
                    apiId,
                    req.method,
                    req.query.path || "/",
                    500,
                    responseTime
                );

        } catch (
            logError
        ) {

            console.error(
                "FAILED TO SAVE GATEWAY LOG:",
                logError
            );
        }


        return res.status(500).json({
            message:
                "Gateway request failed",

            error:
                error.message
        });
    }
};


module.exports = {
    gatewayRequest
};