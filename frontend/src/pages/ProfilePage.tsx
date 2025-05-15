import React, {useEffect, useState} from "react";
import "./profile.css";
import { API_BASE } from "../api";
import { useAuthRedirect } from "../utils/useAuthRedirect";

interface BorrowedBook {
    title: string;
    genre: string;
    start_date: string; 
    end_date: string;
    extension_count: number;
}


const ProfilePage: React.FC = () => {
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [profile, refreshProfile] = useAuthRedirect();
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [error, setError] = useState("");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [door, setDoor] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "">("");
    const [showToast, setShowToast] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [usernamePassword, setUsernamePassword] = useState("");


    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE}/userAPIs/listRentedBooks`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data: BorrowedBook[] = await res.json();
                    const now = new Date();

                    const pastBorrows = data.filter(book => new Date(book.end_date) < now);
                    setBorrowedBooks(pastBorrows);
                }
            } catch (err) {
                console.error("Hiba a könyvek lekérdezésekor:", err);
            }
        };

        (async () => {
            await fetchBorrowedBooks();
        })();
    }, []);

    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending password change data:", { currentPwd, newPwd }); // <-- log sent data
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
                body: JSON.stringify({ passwordOld: currentPwd, passwordNew: newPwd }),
            });
            if (!res.ok) {
                console.log("Jelszó csere sikertelen.")
                return;
            }
            setShowPwdModal(false);
            setToastMessage("Jelszó sikeresen megváltoztatva.");
            setToastType("success");
            setShowToast(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddressChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullAddress = `${zip} ${city}, ${street} ${houseNumber}${floor ? ` ${floor}` : ""}${door ? `/${door}` : ""}`;
        try {
            const res = await fetch(`${API_BASE}/userAPIs/changeAddress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ address: fullAddress }),
            });
            if (!res.ok)  {
                console.error("Cím módosítása sikertelen.");
                return;
            }
            setShowAddressModal(false);
            setToastMessage("Cím sikeresen megváltoztatva.");
            setToastType("success");
            setShowToast(true);
            refreshProfile(); 

        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handlePhoneChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/userAPIs/changePhoneNumber`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ phoneNumber: newPhoneNumber }),
            });
            if (!res.ok){
                setToastMessage("Telefonszám módosítás sikertelen.");
                setToastType("error");
                setShowToast(true);
                return;
            }
            setShowPhoneModal(false);
            setToastMessage("Telefonszám sikeresen megváltoztatva.");
            setToastType("success");
            setShowToast(true);
            refreshProfile();

        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending email change data:", { email: newEmail, password: emailPassword }); // <-- log sent data
        try {
            const res = await fetch(`${API_BASE}/userAPIs/changeEmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    email: newEmail,
                    password: emailPassword,
                }),
            });

            if (!res.ok) {
                setToastMessage("Email cím módosítása sikertelen.");
                setToastType("error");
                setShowToast(true);
                return;
            }

            setShowEmailModal(false);
            setToastMessage("Email cím sikeresen megváltoztatva.");
            setToastType("success");
            setShowToast(true);
            refreshProfile();
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(`${API_BASE}/userAPIs/changeUsername`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
                username: newUsername,
                password: usernamePassword,
            }),
        });
        let message = "";
        try {
            const data = await res.json();
            message = data.detail || data || "";
        } catch {
            message = await res.text();
        }
        if (!res.ok) {
            setToastMessage(message);
            setToastType("error");
            setShowToast(true);
            return;
        }
        setShowUsernameModal(false);
        setToastMessage("Felhasználónév sikeresen megváltoztatva.");
        setToastType("success");
        setShowToast(true);
        refreshProfile();
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
                <button onClick={() => setShowEmailModal(true)}>Email cím megváltoztatása</button>
                <button onClick={() => setShowPwdModal(true)}>Jelszó megváltoztatása</button>
                <button onClick={() => setShowAddressModal(true)}>Cím megváltoztatása</button>
                <button onClick={() => setShowPhoneModal(true)}>Telefonszám megváltoztatása</button>
                <button onClick={() => setShowUsernameModal(true)}>Felhasználónév megváltoztatása</button>
            </div>


            <h2>Korábban kikölcsönzött könyvek</h2>
            {borrowedBooks.length === 0 ? (
                <p>Nincs lejárt kölcsönzés.</p>
            ) : (
                borrowedBooks.map((book, index) => (
                    <div key={index} className="profile-header">
                        <div className="profile-info">
                            <p><strong>Cím:</strong> {book.title}</p>
                            <p><strong>Műfaj:</strong> {book.genre}</p>
                            <p><strong>Kölcsönzés Kezdete:</strong> {new Date(book.start_date).toLocaleDateString()}</p>
                            <p><strong>Kölcsönzés Vége:</strong> {new Date(book.end_date).toLocaleDateString()}</p>
                            <p><strong>Kölcsönzés hosszabbítások száma:</strong> {book.extension_count}</p>
                        </div>
                    </div>
                ))
            )}

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

            {showAddressModal && (
                <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Cím megváltoztatása</h3>
                        {error && <p className="modal-error">{error}</p>}
                        <form onSubmit={handleAddressChange}>
                            <label>Irányítószám*</label>
                            <input
                                type="number"
                                value={zip}
                                onChange={e => setZip(e.target.value)}
                                required
                            />
                            <label>Város*</label>
                            <input
                                type="text"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                            />
                            <label>Utca*</label>
                            <input
                                type="text"
                                value={street}
                                onChange={e => setStreet(e.target.value)}
                                required
                            />
                            <label>Házszám*</label>
                            <input
                                type="number"
                                value={houseNumber}
                                onChange={e => setHouseNumber(e.target.value)}
                                required
                            />
                            <label>Emelet</label>
                            <input
                                type="number"
                                value={floor}
                                onChange={e => setFloor(e.target.value)}
                            />
                            <label>Ajtó</label>
                            <input
                                type="number"
                                value={door}
                                onChange={e => setDoor(e.target.value)}
                            />

                            <div className="modal-buttons">
                                <button type="submit">Mentés</button>
                                <button type="button" onClick={() => setShowAddressModal(false)}>
                                    Mégse
                                </button>
                            </div>
                            <div className="form-note">
                                <p>* kötelező mező</p>
                            </div>

                        </form>
                    </div>
                </div>
            )}
            
            {showPhoneModal && (
                <div className="modal-overlay" onClick={() => setShowPhoneModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Telefonszám megváltoztatása</h3>
                        {error && <p className="modal-error">{error}</p>}
                        <form onSubmit={handlePhoneChange}>
                            <label>Új telefonszám</label>
                            <input
                                type="text"
                                value={newPhoneNumber}
                                onChange={e => setNewPhoneNumber(e.target.value)}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="submit">Mentés</button>
                                <button type="button" onClick={() => setShowPhoneModal(false)}>
                                    Mégse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showToast && (
                <div className={`toast ${toastType}`}>
                    <p>{toastMessage}</p>
                </div>
            )}

            {showEmailModal && (
                <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Email cím megváltoztatása</h3>
                        {error && <p className="modal-error">{error}</p>}
                        <form onSubmit={handleEmailChange}>
                            <label>Új email cím</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                required
                            />
                            <label>Jelenlegi jelszó</label>
                            <input
                                type="password"
                                value={emailPassword}
                                onChange={e => setEmailPassword(e.target.value)}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="submit">Mentés</button>
                                <button type="button" onClick={() => setShowEmailModal(false)}>
                                    Mégse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showUsernameModal && (
                <div className="modal-overlay" onClick={() => setShowUsernameModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Felhasználónév megváltoztatása</h3>
                        {error && <p className="modal-error">{error}</p>}
                        <form onSubmit={handleUsernameChange}>
                            <label>Új felhasználónév</label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                required
                            />
                            <label>Jelenlegi jelszó</label>
                            <input
                                type="password"
                                value={usernamePassword}
                                onChange={e => setUsernamePassword(e.target.value)}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="submit">Mentés</button>
                                <button type="button" onClick={() => setShowUsernameModal(false)}>
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
