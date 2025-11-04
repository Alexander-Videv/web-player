import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';


function Login(props: { toggle: () => void }) {

    const API = "https://web-player-backend.onrender.com";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Store user in session
            sessionStorage.setItem("user", username);

            // Redirect
            navigate('/home');
            props.toggle();
        } catch (err: any) {
            console.error("Error during login:", err);
            setMessage(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {message && <p className="error">{message}</p>}
                <button onClick={props.toggle}>Close</button>
                <Link to={"/register"}>Register</Link>
            </div>
        </div>
    );
}

export default Login;
