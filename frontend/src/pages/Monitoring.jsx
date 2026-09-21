import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    getApis,
    getApiStatistics
} from "../services/api";


const Monitoring = () => {

    const navigate = useNavigate();


    const [apis, setApis] =
        useState([]);

    const [selectedApiId, setSelectedApiId] =
        useState("");

    const [statistics, setStatistics] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // Load APIs
    // ==========================================

    useEffect(() => {

        loadApis();

    }, []);


    // ==========================================
    // Load Statistics
    // ==========================================

    useEffect(() => {

        if (selectedApiId) {

            loadStatistics(
                selectedApiId
            );

        }

    }, [selectedApiId]);


    const loadApis = async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getApis();


            setApis(
                data.apis || []
            );


            if (
                data.apis &&
                data.apis.length > 0
            ) {

                setSelectedApiId(
                    String(
                        data.apis[0].id
                    )
                );

            }

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    const loadStatistics = async (
        apiId
    ) => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getApiStatistics(
                    apiId
                );


            setStatistics(
                data
            );

        } catch (error) {

            setError(
                error.message
            );

            setStatistics(
                null
            );

        } finally {

            setLoading(false);

        }

    };


    const handleRefresh = () => {

        if (selectedApiId) {

            loadStatistics(
                selectedApiId
            );

        }

    };


    const selectedApi =
        apis.find(
            (api) =>
                String(api.id) ===
                String(selectedApiId)
        );


    const stats =
        statistics?.statistics || {};


    // ==========================================
    // Analytics Data
    // ==========================================

    const endpointData =
        statistics?.endpointBreakdown || [];


    const maxEndpointRequests =
        endpointData.length > 0
            ? Math.max(
                  ...endpointData.map(
                      (item) =>
                          Number(
                              item.count || 0
                          )
                  )
              )
            : 0;


    const maxEndpointResponseTime =
        endpointData.length > 0
            ? Math.max(
                  ...endpointData.map(
                      (item) =>
                          Number(
                              item.averageResponseTime ||
                              0
                          )
                  )
              )
            : 0;


    return (

        <div
            style={
                styles.container
            }
        >

            {/* ==========================================
                Header
            ========================================== */}

            <header
                style={
                    styles.header
                }
            >

                <div>

                    <h1
                        style={
                            styles.pageTitle
                        }
                    >
                        API Monitoring
                    </h1>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Monitor API traffic and performance
                    </p>

                </div>


                <div
                    style={
                        styles.headerActions
                    }
                >

                    <button
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading
                        }
                        style={
                            styles.primaryButton
                        }
                    >
                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        style={
                            styles.backButton
                        }
                    >
                        Dashboard
                    </button>

                </div>

            </header>


            <main
                style={
                    styles.main
                }
            >

                {/* ==========================================
                    Error
                ========================================== */}

                {error && (

                    <div
                        style={
                            styles.error
                        }
                    >
                        {error}
                    </div>

                )}


                {/* ==========================================
                    API Selector
                ========================================== */}

                <div
                    style={
                        styles.selectorCard
                    }
                >

                    <label
                        style={
                            styles.label
                        }
                    >
                        Select API
                    </label>


                    <select
                        value={
                            selectedApiId
                        }
                        onChange={(
                            event
                        ) =>
                            setSelectedApiId(
                                event.target.value
                            )
                        }
                        style={
                            styles.select
                        }
                    >

                        {apis.map(
                            (api) => (

                                <option
                                    key={
                                        api.id
                                    }
                                    value={
                                        api.id
                                    }
                                >
                                    {api.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ==========================================
                    API Information
                ========================================== */}

                {selectedApi && (

                    <div
                        style={
                            styles.apiInfo
                        }
                    >

                        <h2
                            style={
                                styles.apiName
                            }
                        >
                            {selectedApi.name}
                        </h2>


                        <p
                            style={
                                styles.baseUrl
                            }
                        >
                            {selectedApi.base_url}
                        </p>

                    </div>

                )}


                {/* ==========================================
                    Empty State
                ========================================== */}

                {!statistics &&
                    !loading && (

                        <div
                            style={
                                styles.empty
                            }
                        >

                            <h2>
                                No monitoring data
                            </h2>

                            <p>
                                Make requests through
                                the API Gateway to
                                generate monitoring
                                data.
                            </p>

                        </div>

                    )}


                {statistics && (

                    <>

                        {/* ==========================================
                            Main Statistics
                        ========================================== */}

                        <div
                            style={
                                styles.statsGrid
                            }
                        >

                            <StatCard
                                label="Total Requests"
                                value={
                                    stats.totalRequests ??
                                    0
                                }
                            />


                            <StatCard
                                label="Successful Requests"
                                value={
                                    stats.successfulRequests ??
                                    0
                                }
                                valueStyle={
                                    styles.successValue
                                }
                            />


                            <StatCard
                                label="Failed Requests"
                                value={
                                    stats.failedRequests ??
                                    0
                                }
                                valueStyle={
                                    styles.failedValue
                                }
                            />


                            <StatCard
                                label="Success Rate"
                                value={
                                    `${stats.successRate ?? 0}%`
                                }
                                valueStyle={
                                    styles.successValue
                                }
                            />


                            <StatCard
                                label="Failure Rate"
                                value={
                                    `${stats.failureRate ?? 0}%`
                                }
                                valueStyle={
                                    styles.failedValue
                                }
                            />


                            <StatCard
                                label="Average Response"
                                value={
                                    `${stats.averageResponseTime ?? 0} ms`
                                }
                            />


                            <StatCard
                                label="Fastest Response"
                                value={
                                    `${stats.fastestResponseTime ?? 0} ms`
                                }
                            />


                            <StatCard
                                label="Slowest Response"
                                value={
                                    `${stats.slowestResponseTime ?? 0} ms`
                                }
                            />


                            <StatCard
                                label="Rate Limit Violations"
                                value={
                                    stats.rateLimitViolations ??
                                    0
                                }
                                valueStyle={
                                    styles.warningValue
                                }
                            />

                        </div>


                        {/* ==========================================
                            Analytics
                        ========================================== */}

                        <div
                            style={
                                styles.analyticsGrid
                            }
                        >

                            {/* ==========================================
                                Request Volume Chart
                            ========================================== */}

                            <div
                                style={
                                    styles.chartCard
                                }
                            >

                                <h2>
                                    Request Volume
                                </h2>

                                <p
                                    style={
                                        styles.chartSubtitle
                                    }
                                >
                                    Requests by endpoint
                                </p>


                                {endpointData.length > 0 ? (

                                    <div
                                        style={
                                            styles.chartArea
                                        }
                                    >

                                        {endpointData.map(
                                            (
                                                item
                                            ) => {

                                                const count =
                                                    Number(
                                                        item.count ||
                                                        0
                                                    );


                                                const width =
                                                    maxEndpointRequests >
                                                    0
                                                        ? (
                                                              count /
                                                              maxEndpointRequests
                                                          ) *
                                                          100
                                                        : 0;


                                                return (

                                                    <div
                                                        key={
                                                            item.endpoint
                                                        }
                                                        style={
                                                            styles.chartRow
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.chartLabel
                                                            }
                                                        >
                                                            <span>
                                                                {
                                                                    item.endpoint
                                                                }
                                                            </span>

                                                            <strong>
                                                                {
                                                                    count
                                                                }
                                                            </strong>
                                                        </div>


                                                        <div
                                                            style={
                                                                styles.barBackground
                                                            }
                                                        >

                                                            <div
                                                                style={{
                                                                    ...styles.requestBar,

                                                                    width:
                                                                        `${width}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                ) : (

                                    <p>
                                        No request data
                                        available.
                                    </p>

                                )}

                            </div>


                            {/* ==========================================
                                Response Time Chart
                            ========================================== */}

                            <div
                                style={
                                    styles.chartCard
                                }
                            >

                                <h2>
                                    Response Time
                                </h2>

                                <p
                                    style={
                                        styles.chartSubtitle
                                    }
                                >
                                    Average response time
                                    by endpoint
                                </p>


                                {endpointData.length > 0 ? (

                                    <div
                                        style={
                                            styles.chartArea
                                        }
                                    >

                                        {endpointData.map(
                                            (
                                                item
                                            ) => {

                                                const responseTime =
                                                    Number(
                                                        item.averageResponseTime ||
                                                        0
                                                    );


                                                const width =
                                                    maxEndpointResponseTime >
                                                    0
                                                        ? (
                                                              responseTime /
                                                              maxEndpointResponseTime
                                                          ) *
                                                          100
                                                        : 0;


                                                return (

                                                    <div
                                                        key={
                                                            item.endpoint
                                                        }
                                                        style={
                                                            styles.chartRow
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.chartLabel
                                                            }
                                                        >

                                                            <span>
                                                                {
                                                                    item.endpoint
                                                                }
                                                            </span>


                                                            <strong>
                                                                {
                                                                    responseTime.toFixed(
                                                                        2
                                                                    )
                                                                }{" "}
                                                                ms
                                                            </strong>

                                                        </div>


                                                        <div
                                                            style={
                                                                styles.barBackground
                                                            }
                                                        >

                                                            <div
                                                                style={{
                                                                    ...styles.responseBar,

                                                                    width:
                                                                        `${width}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                ) : (

                                    <p>
                                        No response-time
                                        data available.
                                    </p>

                                )}

                            </div>

                        </div>


                        {/* ==========================================
                            Status Code Breakdown
                        ========================================== */}

                        <div
                            style={
                                styles.card
                            }
                        >

                            <h2>
                                Status Code Breakdown
                            </h2>


                            {statistics
                                .statusBreakdown
                                ?.length > 0 ? (

                                <div
                                    style={
                                        styles.statusList
                                    }
                                >

                                    {statistics
                                        .statusBreakdown
                                        .map(
                                            (
                                                item
                                            ) => (

                                                <div
                                                    key={
                                                        item.status_code
                                                    }
                                                    style={
                                                        styles.statusItem
                                                    }
                                                >

                                                    <span>
                                                        HTTP{" "}
                                                        {
                                                            item.status_code
                                                        }
                                                    </span>


                                                    <strong>
                                                        {
                                                            item.count
                                                        }
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                </div>

                            ) : (

                                <p>
                                    No status-code
                                    data available.
                                </p>

                            )}

                        </div>


                        {/* ==========================================
                            HTTP Method Breakdown
                        ========================================== */}

                        <div
                            style={
                                styles.card
                            }
                        >

                            <h2>
                                HTTP Method Breakdown
                            </h2>


                            {statistics
                                .methodBreakdown
                                ?.length > 0 ? (

                                <div
                                    style={
                                        styles.statusList
                                    }
                                >

                                    {statistics
                                        .methodBreakdown
                                        .map(
                                            (
                                                item
                                            ) => (

                                                <div
                                                    key={
                                                        item.method
                                                    }
                                                    style={
                                                        styles.statusItem
                                                    }
                                                >

                                                    <span>
                                                        {
                                                            item.method
                                                        }
                                                    </span>


                                                    <strong>
                                                        {
                                                            item.count
                                                        }
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                </div>

                            ) : (

                                <p>
                                    No method data
                                    available.
                                </p>

                            )}

                        </div>


                        {/* ==========================================
                            Top Endpoints
                        ========================================== */}

                        <div
                            style={
                                styles.card
                            }
                        >

                            <h2>
                                Top Endpoints
                            </h2>


                            {endpointData.length > 0 ? (

                                <div
                                    style={
                                        styles.endpointList
                                    }
                                >

                                    {endpointData.map(
                                        (
                                            item
                                        ) => (

                                            <div
                                                key={
                                                    item.endpoint
                                                }
                                                style={
                                                    styles.endpointItem
                                                }
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            item.endpoint
                                                        }
                                                    </strong>


                                                    <p
                                                        style={
                                                            styles.endpointMeta
                                                        }
                                                    >
                                                        Average response:{" "}
                                                        {
                                                            Number(
                                                                item.averageResponseTime ||
                                                                0
                                                            ).toFixed(
                                                                2
                                                            )
                                                        }{" "}
                                                        ms
                                                    </p>

                                                </div>


                                                <span
                                                    style={
                                                        styles.requestCount
                                                    }
                                                >
                                                    {
                                                        item.count
                                                    }{" "}
                                                    requests
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p>
                                    No endpoint data
                                    available.
                                </p>

                            )}

                        </div>


                        {/* ==========================================
                            Recent Requests
                        ========================================== */}

                        <div
                            style={
                                styles.card
                            }
                        >

                            <h2>
                                Recent Requests
                            </h2>


                            {statistics
                                .recentRequests
                                ?.length > 0 ? (

                                <div
                                    style={
                                        styles.tableWrapper
                                    }
                                >

                                    <table
                                        style={
                                            styles.table
                                        }
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Method
                                                </th>

                                                <th>
                                                    Endpoint
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Response Time
                                                </th>

                                                <th>
                                                    Time
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {statistics
                                                .recentRequests
                                                .map(
                                                    (
                                                        request
                                                    ) => (

                                                        <tr
                                                            key={
                                                                request.id
                                                            }
                                                        >

                                                            <td>

                                                                <strong>
                                                                    {
                                                                        request.method
                                                                    }
                                                                </strong>

                                                            </td>


                                                            <td>
                                                                {
                                                                    request.endpoint
                                                                }
                                                            </td>


                                                            <td>

                                                                <span
                                                                    style={{
                                                                        ...styles.statusBadge,

                                                                        ...(request.status_code >=
                                                                            200 &&
                                                                        request.status_code <
                                                                            400
                                                                            ? styles.successBadge
                                                                            : styles.failedBadge)
                                                                    }}
                                                                >
                                                                    {
                                                                        request.status_code
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td>
                                                                {
                                                                    request.response_time
                                                                }{" "}
                                                                ms
                                                            </td>


                                                            <td>
                                                                {
                                                                    request.created_at
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                        </tbody>

                                    </table>

                                </div>

                            ) : (

                                <p>
                                    No recent requests.
                                </p>

                            )}

                        </div>

                    </>

                )}

            </main>

        </div>

    );

};


// ==========================================
// Statistic Card Component
// ==========================================

const StatCard = ({
    label,
    value,
    valueStyle
}) => {

    return (

        <div
            style={
                styles.statCard
            }
        >

            <span
                style={
                    styles.statLabel
                }
            >
                {label}
            </span>


            <strong
                style={{
                    ...styles.statValue,
                    ...valueStyle
                }}
            >
                {value}
            </strong>

        </div>

    );

};


// ==========================================
// Styles
// ==========================================

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f4f6f8"
    },


    header: {
        background: "#ffffff",
        padding: "25px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom:
            "1px solid #ddd"
    },


    pageTitle: {
        margin: 0,
        fontSize: "28px"
    },


    subtitle: {
        marginTop: "6px",
        color: "#666"
    },


    headerActions: {
        display: "flex",
        gap: "10px"
    },


    primaryButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer"
    },


    backButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#6b7280",
        color: "#ffffff",
        cursor: "pointer"
    },


    main: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px"
    },


    selectorCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },


    label: {
        fontWeight: "600"
    },


    select: {
        display: "block",
        width: "100%",
        maxWidth: "500px",
        marginTop: "10px",
        padding: "12px",
        borderRadius: "6px",
        border:
            "1px solid #ccc",
        background: "#ffffff",
        fontSize: "15px"
    },


    apiInfo: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },


    apiName: {
        margin: 0
    },


    baseUrl: {
        color: "#666",
        wordBreak: "break-all"
    },


    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "20px"
    },


    statCard: {
        background: "#ffffff",
        padding: "22px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },


    statLabel: {
        color: "#666",
        fontSize: "14px",
        fontWeight: "500"
    },


    statValue: {
        fontSize: "28px"
    },


    successValue: {
        color: "#15803d"
    },


    failedValue: {
        color: "#dc2626"
    },


    warningValue: {
        color: "#d97706"
    },


    // ==========================================
    // Analytics
    // ==========================================

    analyticsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, 1fr)",
        gap: "20px",
        marginBottom: "20px"
    },


    chartCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },


    chartSubtitle: {
        color: "#666",
        fontSize: "14px",
        marginTop: "-8px",
        marginBottom: "25px"
    },


    chartArea: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },


    chartRow: {
        width: "100%"
    },


    chartLabel: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        fontSize: "14px"
    },


    barBackground: {
        width: "100%",
        height: "12px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden"
    },


    requestBar: {
        height: "100%",
        background: "#2563eb",
        borderRadius: "10px",
        transition:
            "width 0.4s ease"
    },


    responseBar: {
        height: "100%",
        background: "#16a34a",
        borderRadius: "10px",
        transition:
            "width 0.4s ease"
    },


    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },


    statusList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },


    statusItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        border:
            "1px solid #ddd",
        borderRadius: "6px"
    },


    endpointList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },


    endpointItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        border:
            "1px solid #ddd",
        borderRadius: "6px"
    },


    endpointMeta: {
        margin: "6px 0 0",
        color: "#666",
        fontSize: "13px"
    },


    requestCount: {
        fontWeight: "600"
    },


    tableWrapper: {
        overflowX: "auto"
    },


    table: {
        width: "100%",
        borderCollapse: "collapse"
    },


    statusBadge: {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "5px",
        fontWeight: "bold"
    },


    successBadge: {
        background: "#dcfce7",
        color: "#166534"
    },


    failedBadge: {
        background: "#fee2e2",
        color: "#991b1b"
    },


    error: {
        padding: "12px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "6px",
        marginBottom: "20px"
    },


    empty: {
        background: "#ffffff",
        padding: "50px",
        textAlign: "center",
        borderRadius: "10px"
    }

};


export default Monitoring;