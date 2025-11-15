import React, { useState, useEffect } from 'react'; // NEW: Import useState, useEffect
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // use Router is provided by main.jsx
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddStudentPage from './pages/AddStudentPage';
import StudentsListPage from './pages/StudentsListPage';
import EditStudentPage from './pages/EditStudentPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
    // NEW: State to track authentication status and user info
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate(); // For programmatic navigation on logout

    // Effect to check login status from localStorage when the app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (token && email) {
            setIsLoggedIn(true);
            setUserEmail(email);
        }
    }, []); // Runs once on component mount

    // NEW: Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserEmail(null);
        navigate('/login'); // Redirect to login page after logout
    };


    return (
        <div>
                {/* The Navbar will appear on all pages */}
                {/* We might want to pass isLoggedIn and userEmail to Navbar later for dynamic links */}
                <Navbar />

                {/* Updated Navigation Links with conditional rendering */}
                <nav style={{ padding: '10px 20px', backgroundColor: '#ecf0f1', borderBottom: '1px solid #bdc3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
                        <li style={{ marginRight: '15px' }}><Link to="/">Home</Link></li>
                        {isLoggedIn && ( // Only show if logged in
                            <>
                                <li style={{ marginRight: '15px' }}><Link to="/add-student">Add Student</Link></li>
                                <li style={{ marginRight: '15px' }}><Link to="/students">View Students</Link></li>
                            </>
                        )}
                        {!isLoggedIn && ( // Only show if NOT logged in
                            <>
                                <li style={{ marginRight: '15px' }}><Link to="/register">Register</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </>
                        )}
                    </ul>
                    {isLoggedIn && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '15px', fontWeight: 'bold' }}>Welcome, {userEmail}!</span>
                            <button onClick={handleLogout} style={{
                                padding: '8px 12px',
                                backgroundColor: '#e74c3c', // Red for logout
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9em'
                            }}>
                                Logout
                            </button>
                        </div>
                    )}
                </nav>

                {/* Define your routes */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* Protect these routes later using a wrapper component */}
                    <Route path="/add-student" element={<AddStudentPage />} />
                    <Route path="/students" element={<StudentsListPage />} />
                    <Route path="/edit-student/:id" element={<EditStudentPage />} />

                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
    );
}

export default App;