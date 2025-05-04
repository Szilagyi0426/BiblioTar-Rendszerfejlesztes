import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { API_BASE } from "../api";

interface UserProfile {
    username: string;
    email: string;
    role: string;
    address: string;
    phonenumber: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
            return;
        }

        fetch(`${API_BASE}/authAPIs/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.status === 401) {
                    navigate("/");
                    return Promise.reject(new Error("Nem vagy bejelentkezve."));
                }
                if (!res.ok) {
                    throw new Error("Nem sikerült betölteni a profilt.");
                }
                return res.json();
            })
            .then((data: UserProfile) => setProfile(data))
            .catch(err => {
                if (err.message !== "Nem vagy bejelentkezve.") {
                    setError(err.message);
                }
            });
    }, [navigate]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPwd !== confirmPwd) {
            setError("Az új jelszavak nem egyeznek.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/userAPIs/changePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ current_password: currentPwd, new_password: newPwd }),
            });
            if (!res.ok) throw new Error("Jelszó csere sikertelen.");
            setShowPwdModal(false);
            alert("Jelszó sikeresen megváltoztatva.");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (error) {
        return (
            <div className="profile-page">
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <p>Betöltés...</p>
            </div>
        );
    }
    console.log(profile);
    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h2>{profile.username}</h2>
                    <p><strong>Szerep:</strong> {profile.role}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Cím:</strong> {profile.address}</p>
                    <p><strong>Telefonszám:</strong> {profile.phonenumber}</p>
                </div>
            </div>
            
            <div className="profile-actions">
                <button onClick={() => setShowPwdModal(true)}>Jelszó megváltoztatása</button>
                <button onClick={() => navigate("/changeAddress")}>Cím megváltoztatása</button>
                <button onClick={() => navigate("/changePhoneNumber")}>Telefonszám megváltoztatása</button>
            </div>
            
            <h2>Korábban kikölcsönzött könyvek</h2>
            <div className="profile-header">
                <div className="profile-info">
                    <p><strong>Cím:</strong> </p>
                    <p><strong>Műfaj:</strong> </p>
                    <p><strong>Kölcsönzés Kezdete:</strong> </p>
                    <p><strong>Kölcsönzés Vége:</strong></p>
                    <p><strong>Kölcsönzés hosszabítások száma:</strong></p>
                </div>
            </div>
            {showPwdModal && (
                <div className="modal-overlay" onClick={() => setShowPwdModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Jelszó megváltoztatása</h3>
                        {error && <p className="modal-error">{error}</p>}
                        <form onSubmit={handlePasswordChange}>
                            <label>Jelenlegi jelszó</label>
                            <input
                                type="password"
                                value={currentPwd}
                                onChange={e => setCurrentPwd(e.target.value)}
                                required
                            />

                            <label>Új jelszó</label>
                            <input
                                type="password"
                                value={newPwd}
                                onChange={e => setNewPwd(e.target.value)}
                                required
                            />

                            <label>Új jelszó ismét</label>
                            <input
                                type="password"
                                value={confirmPwd}
                                onChange={e => setConfirmPwd(e.target.value)}
                                required
                            />

                            <div className="modal-buttons">
                                <button type="submit">Mentés</button>
                                <button type="button" onClick={() => setShowPwdModal(false)}>
                                    Mégse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
