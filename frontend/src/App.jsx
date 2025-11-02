import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddStudentPage from './pages/AddStudentPage';
import StudentsListPage from './pages/StudentsListPage';
import EditStudentPage from './pages/EditStudentPage';
import RegisterPage from './pages/RegisterPage';


function App(){
    return(
        <Router>
            <div>
                <Navbar/>

                  {/* Updated Navigation Links */}
                <nav style={{ padding: '10px 20px', backgroundColor: '#ecf0f1', borderBottom: '1px solid #bdc3c7' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
                        <li style={{ marginRight: '15px' }}><Link to="/">Home</Link></li>
                        <li style={{ marginRight: '15px' }}><Link to="/add-student">Add Student</Link></li>
                        <li style={{ marginRight: '15px' }}><Link to="/students">View Students</Link></li>
                        <li style={{ marginRight: '15px' }}><Link to="/register">Register</Link></li> {/* NEW */}
                        <li style={{ marginRight: '15px' }}><Link to="/login">Login</Link></li> {/* NEW: Placeholder for Login */}
                    </ul>
                </nav>



                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add-student" element={<AddStudentPage />} />
                    <Route path="/students" element={<StudentsListPage />} />
                    <Route path="/edit-student/:id" element={<EditStudentPage />} />
                     <Route path="/register" element={<RegisterPage />} /> {/* NEW: Register Route */}
                    {/* <Route path="/login" element={<LoginPage />} /> */} {/* Placeholder for Login Route */} 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
