import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getApis,
    createApi,
    updateApi,
    deleteApi
} from "../services/api";


const APIs = () => {

    const navigate = useNavigate();

    const [apis, setApis] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingApi, setEditingApi] = useState(null);

    const [name, setName] = useState("");

    const [baseUrl, setBaseUrl] = useState("");

    const [description, setDescription] = useState("");


    // ==========================================
    // Load APIs
    // ==========================================

    const loadApis = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getApis();

            setApis(data);

        } catch (err) {

            console.error(err);

            setError(
                err.message || "Failed to load APIs"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadApis();

    }, []);


    // ==========================================
    // Clear Form
    // ==========================================

    const clearForm = () => {

        setName("");

        setBaseUrl("");

        setDescription("");

        setEditingApi(null);

        setShowForm(false);
    };


    // ==========================================
    // Create API
    // ==========================================

    const handleCreate = async (e) => {

        e.preventDefault();

        try {

            setError("");

            await createApi(
                name,
                baseUrl,
                description
            );

            clearForm();

            await loadApis();

        } catch (err) {

            console.error(err);

            setError(
                err.message || "Failed to create API"
            );
        }
    };


    // ==========================================
    // Start Editing
    // ==========================================

    const handleEdit = (api) => {

        setEditingApi(api);

        setName(api.name);

        setBaseUrl(api.base_url);

        setDescription(
            api.description || ""
        );

        setShowForm(true);
    };


    // ==========================================
    // Update API
    // ==========================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            setError("");

            await updateApi(
                editingApi.id,
                name,
                baseUrl,
                description
            );

            clearForm();

            await loadApis();

        } catch (err) {

            console.error(err);

            setError(
                err.message || "Failed to update API"
            );
        }
    };


    // ==========================================
    // Delete API
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this API?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteApi(id);

            await loadApis();

        } catch (err) {

            console.error(err);

            setError(
                err.message || "Failed to delete API"
            );
        }
    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <div style={styles.page}>

                <h2>API Management</h2>

                <p>Loading APIs...</p>

            </div>
        );
    }


    return (

        <div style={styles.page}>

            {/* Header */}

            <header style={styles.header}>

                <div>

                    <h1 style={styles.title}>
                        API Management
                    </h1>

                    <p style={styles.subtitle}>
                        Create and manage your APIs
                    </p>

                </div>


                <div style={styles.headerButtons}>

                    <button
                        style={styles.dashboardButton}
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        style={styles.addButton}
                        onClick={() => {

                            if (showForm) {

                                clearForm();

                            } else {

                                setShowForm(true);

                            }

                        }}
                    >
                        {showForm
                            ? "Cancel"
                            : "+ Add API"}
                    </button>

                </div>

            </header>


            {/* Error */}

            {error && (

                <div style={styles.error}>

                    {error}

                </div>

            )}


            {/* Form */}

            {showForm && (

                <div style={styles.formCard}>

                    <h2>

                        {editingApi
                            ? "Update API"
                            : "Create New API"}

                    </h2>


                    <form
                        onSubmit={
                            editingApi
                                ? handleUpdate
                                : handleCreate
                        }
                    >

                        <label style={styles.label}>
                            API Name
                        </label>

                        <input
                            type="text"
                            placeholder="JSONPlaceholder API"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                            style={styles.input}
                        />


                        <label style={styles.label}>
                            Base URL
                        </label>

                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={baseUrl}
                            onChange={(e) =>
                                setBaseUrl(
                                    e.target.value
                                )
                            }
                            required
                            style={styles.input}
                        />


                        <label style={styles.label}>
                            Description
                        </label>

                        <textarea
                            placeholder="Enter API description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            style={styles.textarea}
                        />


                        <div style={styles.formButtons}>

                            <button
                                type="submit"
                                style={styles.saveButton}
                            >

                                {editingApi
                                    ? "Update API"
                                    : "Create API"}

                            </button>


                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={clearForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* API List */}

            <div style={styles.content}>

                <h2>
                    Your APIs
                </h2>


                {apis.length === 0 ? (

                    <div style={styles.empty}>

                        <h3>
                            No APIs found
                        </h3>

                        <p>
                            Create your first API
                            to get started.
                        </p>

                        <button
                            style={styles.addButton}
                            onClick={() =>
                                setShowForm(true)
                            }
                        >
                            + Add API
                        </button>

                    </div>

                ) : (

                    <div style={styles.grid}>

                        {apis.map((api) => (

                            <div
                                key={api.id}
                                style={styles.card}
                            >

                                <div>

                                    <h3>
                                        {api.name}
                                    </h3>

                                    <p
                                        style={
                                            styles.url
                                        }
                                    >
                                        {api.base_url}
                                    </p>

                                    {api.description && (

                                        <p>
                                            {
                                                api.description
                                            }
                                        </p>

                                    )}

                                </div>


                                <div
                                    style={
                                        styles.actions
                                    }
                                >

                                    <button
                                        style={
                                            styles.keyButton
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/api-keys/${api.id}`
                                            )
                                        }
                                    >
                                        API Keys
                                    </button>


                                    <button
                                        style={
                                            styles.editButton
                                        }
                                        onClick={() =>
                                            handleEdit(api)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        style={
                                            styles.deleteButton
                                        }
                                        onClick={() =>
                                            handleDelete(
                                                api.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};


// ==========================================
// Styles
// ==========================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "30px 40px"
    },

    header: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    title: {
        margin: 0,
        fontSize: "28px"
    },

    subtitle: {
        marginTop: "8px",
        color: "#666"
    },

    headerButtons: {
        display: "flex",
        gap: "10px"
    },

    dashboardButton: {
        padding: "10px 18px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#ffffff",
        cursor: "pointer"
    },

    addButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer"
    },

    content: {
        marginTop: "25px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    url: {
        color: "#2563eb",
        wordBreak: "break-all"
    },

    actions: {
        display: "flex",
        gap: "8px",
        marginTop: "20px"
    },

    keyButton: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#7c3aed",
        color: "#ffffff",
        cursor: "pointer"
    },

    editButton: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#f59e0b",
        color: "#ffffff",
        cursor: "pointer"
    },

    deleteButton: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#dc2626",
        color: "#ffffff",
        cursor: "pointer"
    },

    formCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "25px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        maxWidth: "700px"
    },

    label: {
        display: "block",
        marginTop: "15px",
        marginBottom: "6px",
        fontWeight: "600"
    },

    input: {
        width: "100%",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },

    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        resize: "vertical"
    },

    formButtons: {
        display: "flex",
        gap: "10px",
        marginTop: "20px"
    },

    saveButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer"
    },

    cancelButton: {
        padding: "10px 20px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#ffffff",
        cursor: "pointer"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "15px",
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


export default APIs;