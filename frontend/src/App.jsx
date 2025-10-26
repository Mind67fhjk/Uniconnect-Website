import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddStudentPage from './pages/AddStudentPage';
import StudentsListPage from './pages/StudentsListPage';


function App(){
    return(
        <Router>
            <div>
                <Navbar/>

                <nav style={{ padding: '10px 20px', backgroundColor: '#ecf0f1', borderBottom: '1px solid #bdc3c7'}}>
                    <ul style = {{listStyle: 'none', margin: 0, padding: 0, display: 'flex'}}>
                        <li style={{marginRight: '15px'}}><Link to="/">Home</Link></li>
                        <li style={{ marginRight : '15px '}}><Link to="/add-student">Add Student</Link></li>
                        <li><Link to="/students">View Students</Link></li>
                    </ul>
                </nav>



                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add-student" element={<AddStudentPage />} />
                    <Route path="/students" element={<StudentsListPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
