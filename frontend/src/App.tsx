// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterPersonalData from './pages/RegisterPersonalData';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Books from './pages/Books'
import Reservations from './pages/Reservations';
// …etc.

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/RegisterPersonalData" element={<RegisterPersonalData />} />
            
            <Route element={<Layout />}> {/* Minden bejelentkezett oldal elérése ide megy*/}
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/books" element={<Books />} />
                <Route path="/reservations" element={<Reservations />} />


            </Route>
        </Routes>
    );
}

export default App;
