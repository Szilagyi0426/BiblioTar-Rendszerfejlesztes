import React from "react";
import { useAuthRedirect } from "../utils/useAuthRedirect";



const HomePage: React.FC = () => {
    const profile = useAuthRedirect();
    
    if (!profile) {
        return <p>Betöltés...</p>;
    }
    
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>This is a protected route.</p>
        </div>
        
    );
};

export default HomePage;