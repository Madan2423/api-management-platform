import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    logoutUser,
    getApis,
    getApiHealth
} from "../services/api";


const Dashboard = () => {

    const navigate = useNavigate();


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const [apis, setApis] =
        useState([]);

    const [health, setHealth] =
        useState(null);

    const [healthLoading, setHealthLoading] =
        useState(false);

    const [healthError, setHealthError] =
        useState("");


    // ==========================================
    // Load APIs
    // ==========================================

    useEffect(() => {

        loadApis();

    }, []);


    const loadApis = async () => {

        try {

            const data =
                await getApis();


            const apiList =
                data.apis || [];


            setApis(apiList);


            // Check health of first API
            if (apiList.length > 0) {

                checkHealth(
                    apiList[0].id
                );
            }

        } catch (error) {

            console.error(
                "LOAD APIs ERROR:",
                error
            );
        }
    };


    // ==========================================
    // Check API Health
    // ==========================================

    const checkHealth = async (
        apiId
    ) => {

        try {

            setHealthLoading(true);

            setHealthError("");


            const data =
                await getApiHealth(
                    apiId
                );


            setHealth(
                data.health
            );

        } catch (error) {

            console.error(
                "HEALTH CHECK ERROR:",
                error
            );


            setHealthError(
                error.message
            );


            setHealth(null);

        } finally {

            setHealthLoading(false);
        }
    };


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        logoutUser();

        navigate("/login");
    };


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

                    <h1>
                        API Management Platform
                    </h1>

                    <p>
                        Welcome,{" "}
                        {user?.name || "User"}
                    </p>

                </div>


                <button
                    onClick={
                        handleLogout
                    }
                    style={
                        styles.logout
                    }
                >
                    Logout
                </button>

            </header>


            <main
                style={
                    styles.main
                }
            >

                <h2>
                    Dashboard
                </h2>


                {/* ==========================================
                    Main Cards
                ========================================== */}

                <div
                    style={
                        styles.cards
                    }
                >

                    {/* APIs */}

                    <div
                        style={
                            styles.card
                        }
                        onClick={() =>
                            navigate(
                                "/apis"
                            )
                        }
                    >

                        <div
                            style={
                                styles.icon
                            }
                        >
                            🔌
                        </div>


                        <h3>
                            APIs
                        </h3>


                        <p>
                            Create and manage
                            your APIs
                        </p>


                        <button
                            style={
                                styles.cardButton
                            }
                        >
                            Manage APIs
                        </button>

                    </div>


                    {/* API Keys */}

                    <div
                        style={
                            styles.card
                        }
                        onClick={() =>
                            navigate(
                                "/apis"
                            )
                        }
                    >

                        <div
                            style={
                                styles.icon
                            }
                        >
                            🔑
                        </div>


                        <h3>
                            API Keys
                        </h3>


                        <p>
                            Manage access keys
                        </p>


                        <button
                            style={
                                styles.cardButton
                            }
                        >
                            Manage API Keys
                        </button>

                    </div>


                    {/* Monitoring */}

                    <div
                        style={
                            styles.card
                        }
                        onClick={() =>
                            navigate(
                                "/monitoring"
                            )
                        }
                    >

                        <div
                            style={
                                styles.icon
                            }
                        >
                            📊
                        </div>


                        <h3>
                            Monitoring
                        </h3>


                        <p>
                            Monitor API traffic
                            and performance
                        </p>


                        <button
                            style={
                                styles.cardButton
                            }
                        >
                            View Monitoring
                        </button>

                    </div>

                </div>


                {/* ==========================================
                    API Health
                ========================================== */}

                <div
                    style={
                        styles.healthSection
                    }
                >

                    <div
                        style={
                            styles.healthHeader
                        }
                    >

                        <div>

                            <h2
                                style={
                                    styles.healthTitle
                                }
                            >
                                API Health
                            </h2>

                            <p
                                style={
                                    styles.healthSubtitle
                                }
                            >
                                Current health of your
                                API services
                            </p>

                        </div>


                        {apis.length > 0 && (

                            <button
                                onClick={() =>
                                    checkHealth(
                                        apis[0].id
                                    )
                                }
                                disabled={
                                    healthLoading
                                }
                                style={
                                    styles.refreshButton
                                }
                            >
                                {healthLoading
                                    ? "Checking..."
                                    : "Check Health"}
                            </button>

                        )}

                    </div>


                    {/* Health Error */}

                    {healthError && (

                        <div
                            style={
                                styles.error
                            }
                        >
                            {healthError}
                        </div>

                    )}


                    {/* No APIs */}

                    {apis.length === 0 &&
                        !healthLoading && (

                            <div
                                style={
                                    styles.empty
                                }
                            >
                                No APIs available.
                                Create an API to
                                monitor its health.
                            </div>

                        )}


                    {/* Health Loading */}

                    {healthLoading && (

                        <div
                            style={
                                styles.loading
                            }
                        >
                            Checking API health...
                        </div>

                    )}


                    {/* Health Data */}

                    {health &&
                        !healthLoading && (

                            <div
                                style={
                                    styles.healthCard
                                }
                            >

                                <div
                                    style={
                                        styles.healthStatus
                                    }
                                >

                                    <div
                                        style={{
                                            ...styles.statusDot,

                                            background:
                                                health.healthy
                                                    ? "#16a34a"
                                                    : "#dc2626"
                                        }}
                                    />

                                    <div>

                                        <strong
                                            style={
                                                styles.statusText
                                            }
                                        >
                                            {health.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                health.status.slice(
                                                    1
                                                )}
                                        </strong>

                                        <p
                                            style={
                                                styles.statusDescription
                                            }
                                        >
                                            API is currently
                                            {health.healthy
                                                ? " operational"
                                                : " unavailable"}
                                        </p>

                                    </div>

                                </div>


                                <div
                                    style={
                                        styles.healthMetrics
                                    }
                                >

                                    <div
                                        style={
                                            styles.metric
                                        }
                                    >

                                        <span>
                                            HTTP Status
                                        </span>

                                        <strong>
                                            {
                                                health.httpStatus ??
                                                "N/A"
                                            }
                                        </strong>

                                    </div>


                                    <div
                                        style={
                                            styles.metric
                                        }
                                    >

                                        <span>
                                            Response Time
                                        </span>

                                        <strong>
                                            {
                                                health.responseTime
                                            }{" "}
                                            ms
                                        </strong>

                                    </div>


                                    <div
                                        style={
                                            styles.metric
                                        }
                                    >

                                        <span>
                                            Last Checked
                                        </span>

                                        <strong>
                                            {health.checkedAt
                                                ? new Date(
                                                      health.checkedAt
                                                  ).toLocaleTimeString()
                                                : "N/A"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        )}

                </div>

            </main>

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
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom:
            "1px solid #ddd"
    },


    main: {
        padding: "40px"
    },


    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "20px",
        marginTop: "25px"
    },


    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        cursor: "pointer"
    },


    icon: {
        fontSize: "30px",
        marginBottom: "10px"
    },


    cardButton: {
        padding: "10px 15px",
        cursor: "pointer",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff"
    },


    logout: {
        padding: "10px 18px",
        cursor: "pointer"
    },


    healthSection: {
        background: "#ffffff",
        marginTop: "30px",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },


    healthHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },


    healthTitle: {
        margin: 0
    },


    healthSubtitle: {
        marginTop: "5px",
        color: "#666"
    },


    refreshButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer"
    },


    healthCard: {
        border:
            "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px"
    },


    healthStatus: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "25px"
    },


    statusDot: {
        width: "14px",
        height: "14px",
        borderRadius: "50%"
    },


    statusText: {
        fontSize: "20px"
    },


    statusDescription: {
        margin: "5px 0 0",
        color: "#666"
    },


    healthMetrics: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "20px"
    },


    metric: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "6px"
    },


    loading: {
        padding: "20px",
        textAlign: "center",
        color: "#666"
    },


    empty: {
        padding: "20px",
        textAlign: "center",
        color: "#666"
    },


    error: {
        padding: "12px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "6px",
        marginBottom: "15px"
    }
};


export default Dashboard;