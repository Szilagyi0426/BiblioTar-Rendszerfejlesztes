import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPersonalData } from "../api";
import "./personalData.css";

const PersonalData: React.FC = () => {
    const [ZIP, setZIP] = useState("");
    const [town, setTown] = useState("");
    const [address, setAddress] = useState("");
    const [houseNumber, setHO] = useState("");
    const [floor, setFloor] = useState("");
    const [door, setDoor] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"error" | "success" | "">("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
        } 
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToastMessage("");
        setToastType("");
        try {
            const wholeAddress = `${ZIP} ${town}, ${address} ${houseNumber}${floor ? ` ${floor}` : ""}${door ? `/${door}` : ""}`;
            await setPersonalData(wholeAddress, phoneNumber);
            setToastMessage("Személyes adatok sikeresen beállítva!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } catch (err) {
            setToastMessage(err instanceof Error ? err.message : "Személyes adatok beállítása sikertelen.");
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
                    <h2>Személyes Adatok</h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-group">
                            <label htmlFor="ZIP">Irányítószám*:</label>
                            <input id="ZIP" type="number" value={ZIP} onChange={(e) => setZIP(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="town">Település*:</label>
                            <input id="town" type="text" value={town} onChange={(e) => setTown(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Utca*:</label>
                            <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="houseNumber">Házszám*:</label>
                            <input id="houseNumber" type="text" value={houseNumber} onChange={(e) => setHO(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="floor">Emelet:</label>
                            <input id="floor" type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="door">Ajtó:</label>
                            <input id="door" type="number" value={door} onChange={(e) => setDoor(e.target.value)} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="phoneNumber">Telefonszám*:</label>
                            <input id="phoneNumber" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                        
                        <div className="full-width">
                            <button type="submit">Személyes adatok megadása</button>
                        </div>
                    </form>
                    <div className="login-footer">
                        <p id="fott-note">* Kötelező mezők</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PersonalData;
