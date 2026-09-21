import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";


const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await registerUser(
                name,
                email,
                password
            );


            alert(
                "Registration successful. Please login."
            );


            navigate("/login");


        } catch (error) {

            setError(
                error.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1 style={styles.title}>
                    API Management
                    <br />
                    Platform
                </h1>


                <p style={styles.subtitle}>
                    Create your account
                </p>


                <form onSubmit={handleRegister}>

                    <label style={styles.label}>
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                        style={styles.input}
                    />


                    <label style={styles.label}>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                        style={styles.input}
                    />


                    <label style={styles.label}>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        minLength={6}
                        style={styles.input}
                    />


                    {error && (

                        <p style={styles.error}>
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                </form>


                <p style={styles.loginText}>

                    Already have an account?{" "}

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                        style={styles.loginLink}
                    >
                        Login
                    </span>

                </p>

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
        padding: "40px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.1)"
    },


    title: {
        textAlign: "center",
        fontSize: "36px",
        marginBottom: "15px"
    },


    subtitle: {
        textAlign: "center",
        color: "#666",
        fontSize: "20px",
        marginBottom: "30px"
    },


    label: {
        display: "block",
        fontSize: "18px",
        marginBottom: "8px"
    },


    input: {
        width: "100%",
        padding: "14px",
        fontSize: "16px",
        marginBottom: "15px",
        border:
            "1px solid #ccc",
        borderRadius: "8px",
        boxSizing: "border-box"
    },


    button: {
        width: "100%",
        padding: "14px",
        marginTop: "10px",
        background: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        cursor: "pointer"
    },


    error: {
        color: "#ef4444",
        fontSize: "16px",
        marginBottom: "10px"
    },


    loginText: {
        textAlign: "center",
        marginTop: "25px",
        fontSize: "16px"
    },


    loginLink: {
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "bold"
    }

};


export default Register;