import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import "./auth.css";

const Login: React.FC = () => {
    const [localUsername, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"error" | "success" | "">("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToastMessage("");
        setToastType("");
        try {
            const response = await loginUser(localUsername, password);
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            localStorage.setItem("username", localUsername);
            localStorage.setItem("userRole", response.role);

            setToastMessage("Sikeres bejelentkezés!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } catch (err) {
            setToastMessage("Bejelentkezés sikertelen.");
            setToastType("error");
            setShowToast(true);
        }
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <>
            {showToast && (
                <div className={`toast ${toastType}`}>
                    <p>{toastMessage}</p>
                </div>
            )}
            <div className="login-container">
                <div className="login-box">
                    <img src="/img/logo.png" alt="BiblioTár logo, Created By: ChatGPT 4o" className="login-logo" />
                    <h2>Bejelentkezés</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Felhasználónév</label>
                            <input
                                id="username"
                                type="text"
                                value={localUsername}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Jelszó</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Bejelentkezés</button>
                    </form>

                    <div className="register-redirect">
                        <button
                            className="register-button"
                            onClick={() => navigate("/register")}
                        >
                            Még nincs fiókod? <span>Regisztrálj</span>
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default Login;
