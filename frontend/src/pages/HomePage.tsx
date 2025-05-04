import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const HomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>This is a protected route.</p>
        </div>
        
    );
};

export default HomePage;