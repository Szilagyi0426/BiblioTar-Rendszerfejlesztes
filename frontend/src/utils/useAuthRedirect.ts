import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "./tokenChecker";
import { API_BASE } from "../api";

interface UserProfile {
    username: string;
    email: string;
    role: string;
    address: string;
    phonenumber: string;
}


export const useAuthRedirect = (): [UserProfile | null, () => void] => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();

    const fetchProfile = () => {
        const token = localStorage.getItem("access_token");

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem("access_token");
            navigate("/", { replace: true });
            return;
        }

        fetch(`${API_BASE}/authAPIs/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    localStorage.removeItem("access_token");
                    navigate("/", { replace: true });
                    return null;
                }
                return res.json();
            })
            .then((data: UserProfile | null) => {
                if (data) setProfile(data);
            });
    };

    useEffect(fetchProfile, [navigate]);

    return [profile, fetchProfile]; 
};
