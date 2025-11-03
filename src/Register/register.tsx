import React, { useState } from "react";
import "../Login/Login"; // reuse your existing popup styling
import { useNavigate } from "react-router-dom";

function Register(props: { toggle: () => void }) {

    const API = process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setMessage("✅ Registration successful! You can now log in.");
            sessionStorage.setItem("user", username);

            // Optionally auto-login or redirect:
            setTimeout(() => {
                props.toggle(); // close popup
                navigate("/home");
            }, 1500);
        } catch (err: any) {
            console.error("❌ Error during registration:", err);
            setMessage(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                {message && <p className="message">{message}</p>}

                <button onClick={props.toggle}>Close</button>
            </div>
        </div>
    );
}

export default Register;
