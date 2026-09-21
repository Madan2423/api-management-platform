import { useEffect, useState } from "react";

import {
    getApis,
    createApi,
    updateApi,
    deleteApi
} from "../services/api";

import { useNavigate } from "react-router-dom";


const ApiManagement = () => {

    const navigate = useNavigate();


    const [apis, setApis] = useState([]);

    const [name, setName] = useState("");

    const [baseUrl, setBaseUrl] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    useEffect(() => {

        loadApis();

    }, []);


    const loadApis = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getApis();

            setApis(
                data.apis
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const clearForm = () => {

        setName("");

        setBaseUrl("");

        setDescription("");

        setEditingId(null);
    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");

        setMessage("");


        if (!name || !baseUrl) {

            setError(
                "API name and Base URL are required"
            );

            return;
        }


        try {

            setLoading(true);


            if (editingId) {

                await updateApi(
                    editingId,
                    name,
                    baseUrl,
                    description
                );

                setMessage(
                    "API updated successfully"
                );

            } else {

                await createApi(
                    name,
                    baseUrl,
                    description
                );

                setMessage(
                    "API created successfully"
                );
            }


            clearForm();

            await loadApis();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const handleEdit = (api) => {

        setEditingId(api.id);

        setName(api.name);

        setBaseUrl(api.base_url);

        setDescription(
            api.description || ""
        );

        setError("");

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this API?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setLoading(true);

            setError("");

            setMessage("");


            await deleteApi(id);


            setMessage(
                "API deleted successfully"
            );


            if (editingId === id) {
                clearForm();
            }


            await loadApis();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div style={styles.container}>

            <div style={styles.header}>

                <div>

                    <h1>
                        API Management
                    </h1>

                    <p>
                        Create and manage your APIs
                    </p>

                </div>

            </div>


            <div style={styles.content}>

                <div style={styles.formCard}>

                    <h2>
                        {editingId
                            ? "Edit API"
                            : "Create API"}
                    </h2>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        style={styles.form}
                    >

                        <label>
                            API Name
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Payment API"
                            value={name}
                            onChange={(
                                event
                            ) =>
                                setName(
                                    event.target.value
                                )
                            }
                        />


                        <label>
                            Base URL
                        </label>

                        <input
                            type="url"
                            placeholder="https://api.example.com"
                            value={baseUrl}
                            onChange={(
                                event
                            ) =>
                                setBaseUrl(
                                    event.target.value
                                )
                            }
                        />


                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Describe your API"
                            value={
                                description
                            }
                            onChange={(
                                event
                            ) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows="4"
                            style={
                                styles.textarea
                            }
                        />


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
                                styles.formButtons
                            }
                        >

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update API"
                                    : "Create API"}
                            </button>


                            {editingId && (
                                <button
                                    type="button"
                                    onClick={
                                        clearForm
                                    }
                                    style={
                                        styles.cancelButton
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>


                <div style={styles.listCard}>

                    <div
                        style={
                            styles.listHeader
                        }
                    >

                        <h2>
                            My APIs
                        </h2>

                        <span>
                            {apis.length} APIs
                        </span>

                    </div>


                    {loading &&
                        apis.length === 0 && (
                            <p>
                                Loading APIs...
                            </p>
                        )}


                    {!loading &&
                        apis.length === 0 && (
                            <div
                                style={
                                    styles.empty
                                }
                            >
                                <h3>
                                    No APIs yet
                                </h3>

                                <p>
                                    Create your first
                                    API using the form.
                                </p>
                            </div>
                        )}


                    <div
                        style={
                            styles.apiList
                        }
                    >

                        {apis.map(
                            (api) => (

                                <div
                                    key={api.id}
                                    style={
                                        styles.apiItem
                                    }
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

                                        <small>
                                            Created:{" "}
                                            {
                                                api.created_at
                                            }
                                        </small>

                                    </div>


                                    <div
                                        style={
                                            styles.actions
                                        }
                                    >

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    api
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/apis/${api.id}/keys`
                                                )
                                            }
                                        >
                                            API Keys
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    api.id
                                                )
                                            }
                                            style={
                                                styles.deleteButton
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

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
        borderBottom:
            "1px solid #ddd"
    },

    content: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px"
    },

    formCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "25px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    listCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    textarea: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontFamily: "inherit",
        fontSize: "15px",
        resize: "vertical"
    },

    formButtons: {
        display: "flex",
        gap: "10px",
        marginTop: "10px"
    },

    cancelButton: {
        background: "#6b7280"
    },

    error: {
        padding: "10px",
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "6px"
    },

    success: {
        padding: "10px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "6px"
    },

    listHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },

    apiList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    apiItem: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        gap: "20px"
    },

    url: {
        color: "#2563eb",
        wordBreak: "break-all"
    },

    actions: {
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },

    deleteButton: {
        background: "#dc2626"
    },

    empty: {
        textAlign: "center",
        padding: "40px",
        color: "#666"
    }
};


export default ApiManagement;