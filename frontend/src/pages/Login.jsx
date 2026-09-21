import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";


const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            const data = await loginUser(
                email,
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

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

            <div style={styles.card}>

                <h1 style={styles.title}>
                    API Management Platform
                </h1>

                <p style={styles.subtitle}>
                    Sign in to manage your APIs
                </p>


                <form
                    onSubmit={handleSubmit}
                    style={styles.form}
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        required
                    />


                    {error && (
                        <p style={styles.error}>
                            {error}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};


const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
    },

    card: {
        width: "400px",
        padding: "35px",
        background: "white",
        borderRadius: "12px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.1)"
    },

    title: {
        marginBottom: "8px",
        textAlign: "center"
    },

    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    error: {
        color: "#d32f2f",
        margin: "5px 0"
    }
};


export default Login;