import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./navbar.css";
import { API_BASE } from "../api";

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const username = localStorage.getItem("username") || "Felhasználó";

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const handleNavigation = (path: string) => {
        navigate(path);
        setDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await fetch(`${API_BASE}/authAPIs/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Logout failed", err);
        }
        localStorage.clear();
        setDropdownOpen(false);
        navigate("/");
    };

    return (
        <div className="home-wrapper">
            <header className="navbar">
                <div className="navbar-left">
                    <span className="navbar-logo" onClick={() => handleNavigation("/home")}>
                        <img src="/img/logo.png" alt="BiblioTár logo" className="logo" />
                    </span>
                </div>
                <div className="navbar-center">
                    <button onClick={() => handleNavigation("/books")}>Könyvek</button>
                    <button onClick={() => handleNavigation("/fines")}>Büntetések</button>
                    <button onClick={() => handleNavigation("/reservations")}>Foglalások</button>
                    <button onClick={() => handleNavigation("/contact")}>Kapcsolat</button>
                </div>
                <div className="navbar-right">
                    <div className="profile-wrapper" onClick={() => setDropdownOpen(prev => !prev)}>
                        <span className="username">{username}</span>
                        <div className="avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleNavigation("/profile")}>Profil</button>
                            {/*<button onClick={() => handleNavigation("/fines")}>Büntetések</button>*/}
                            {/*<button onClick={() => handleNavigation("/reservations")}>Foglalások</button>*/}
                            <button onClick={handleLogout}>Kijelentkezés</button>
                        </div>
                    )}
                </div>
            </header>

            {/* Render child pages here */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
