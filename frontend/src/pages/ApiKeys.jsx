import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    getApis,
    getApiKeys,
    generateApiKey,
    revokeApiKey
} from "../services/api";


const ApiKeys = () => {

    const { apiId } = useParams();

    const navigate = useNavigate();


    const [api, setApi] =
        useState(null);

    const [keys, setKeys] =
        useState([]);

    const [newKey, setNewKey] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    useEffect(() => {

        loadData();

    }, [apiId]);


    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const apiData =
                await getApis();

            const selectedApi =
                apiData.apis.find(
                    (item) =>
                        item.id ===
                        Number(apiId)
                );


            if (!selectedApi) {

                setError(
                    "API not found"
                );

                return;
            }


            setApi(
                selectedApi
            );


            const keyData =
                await getApiKeys(
                    apiId
                );


            setKeys(
                keyData.apiKeys || []
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const handleGenerate = async () => {

        try {

            setLoading(true);

            setError("");

            setMessage("");

            setNewKey("");


            const data =
                await generateApiKey(
                    apiId
                );


            /*
             * The raw key should only be
             * displayed immediately after
             * generation.
             */

            setNewKey(
                data.apiKey ||
                data.key ||
                data.rawKey ||
                ""
            );


            setMessage(
                "API key generated successfully. Copy it now."
            );


            await loadData();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const handleRevoke = async (
        keyId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to revoke this API key?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setLoading(true);

            setError("");

            setMessage("");


            await revokeApiKey(
                apiId,
                keyId
            );


            setMessage(
                "API key revoked successfully"
            );


            await loadData();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const copyKey = async () => {

        if (!newKey) {
            return;
        }


        await navigator.clipboard.writeText(
            newKey
        );


        setMessage(
            "API key copied to clipboard"
        );
    };


    if (loading && !api) {

        return (
            <div style={styles.center}>
                Loading...
            </div>
        );
    }


    return (
        <div style={styles.container}>

            <header style={styles.header}>

                <div>

                    <h1>
                        API Keys
                    </h1>

                    {api && (
                        <p>
                            {api.name}
                        </p>
                    )}

                </div>


                <button
                    onClick={() =>
                        navigate("/apis")
                    }
                    style={
                        styles.backButton
                    }
                >
                    Back to APIs
                </button>

            </header>


            <main style={styles.main}>

                {error && (
                    <div
                        style={
                            styles.error
                        }
                    >
                        {error}
                    </div>
                )}


                {message && (
                    <div
                        style={
                            styles.success
                        }
                    >
                        {message}
                    </div>
                )}


                <div
                    style={
                        styles.generateCard
                    }
                >

                    <h2>
                        Generate API Key
                    </h2>

                    <p>
                        Generate a key to allow
                        clients to access this API
                        through the API Gateway.
                    </p>


                    <button
                        onClick={
                            handleGenerate
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Generating..."
                            : "Generate API Key"}
                    </button>

                </div>


                {newKey && (
                    <div
                        style={
                            styles.keyCard
                        }
                    >

                        <h2>
                            New API Key
                        </h2>

                        <p
                            style={
                                styles.warning
                            }
                        >
                            ⚠️ Copy this key now.
                            It will not be shown
                            again after you leave
                            this page.
                        </p>


                        <div
                            style={
                                styles.keyContainer
                            }
                        >

                            <input
                                type="text"
                                value={newKey}
                                readOnly
                            />

                            <button
                                onClick={
                                    copyKey
                                }
                            >
                                Copy
                            </button>

                        </div>

                    </div>
                )}


                <div
                    style={
                        styles.keysCard
                    }
                >

                    <div
                        style={
                            styles.titleRow
                        }
                    >

                        <h2>
                            API Keys
                        </h2>

                        <span>
                            {keys.length} keys
                        </span>

                    </div>


                    {keys.length === 0 ? (

                        <div
                            style={
                                styles.empty
                            }
                        >
                            <h3>
                                No API keys
                            </h3>

                            <p>
                                Generate an API key
                                to access this API.
                            </p>
                        </div>

                    ) : (

                        <div
                            style={
                                styles.keyList
                            }
                        >

                            {keys.map(
                                (key) => (

                                    <div
                                        key={
                                            key.id
                                        }
                                        style={
                                            styles.keyItem
                                        }
                                    >

                                        <div>

                                            <strong>
                                                API Key #
                                                {key.id}
                                            </strong>

                                            <p>
                                                Status:{" "}
                                                <span
                                                    style={{
                                                        color:
                                                            key.status ===
                                                            "active"
                                                                ? "#16a34a"
                                                                : "#dc2626"
                                                    }}
                                                >
                                                    {
                                                        key.status
                                                    }
                                                </span>
                                            </p>

                                            <small>
                                                Created:{" "}
                                                {
                                                    key.created_at
                                                }
                                            </small>

                                        </div>


                                        {key.status ===
                                            "active" && (

                                            <button
                                                onClick={() =>
                                                    handleRevoke(
                                                        key.id
                                                    )
                                                }
                                                style={
                                                    styles.revokeButton
                                                }
                                            >
                                                Revoke
                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};


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

    main: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px 20px"
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    backButton: {
        background: "#6b7280"
    },

    generateCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    keyCard: {
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "20px"
    },

    keysCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    titleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    keyContainer: {
        display: "flex",
        gap: "10px"
    },

    warning: {
        color: "#c2410c",
        fontWeight: "bold"
    },

    keyList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    keyItem: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    revokeButton: {
        background: "#dc2626"
    },

    error: {
        padding: "12px",
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "6px",
        marginBottom: "15px"
    },

    success: {
        padding: "12px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "6px",
        marginBottom: "15px"
    },

    empty: {
        textAlign: "center",
        padding: "40px",
        color: "#666"
    }
};


export default ApiKeys;