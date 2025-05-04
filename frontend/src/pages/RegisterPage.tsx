import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import "./auth.css";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
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
            const response = await registerUser(username, email, password, passwordAgain);
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            localStorage.setItem("username", username);
            setToastMessage("Sikeres Regisztráció!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                navigate("/RegisterPersonalData");
            }, 1000);
        } catch (err) {
            setToastMessage(err instanceof Error ? err.message : "Regisztráció sikertelen.");
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

                    <h2>Regisztráció</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Felhasználónév</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email cím</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        <div>
                            <label htmlFor="password">Jelszó Ismét</label>
                            <input
                                id="passwordAgain"
                                type="password"
                                value={passwordAgain}
                                onChange={(e) => setPasswordAgain(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Regisztrálás</button>
                    </form>

                    <div className="register-redirect">
                        <button className="register-button"
                            onClick={() => navigate("/")}
                        >
                            Van már fiókod? <span>Jelentkezz be!</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Register;
