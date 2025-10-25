import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar';


function App(){

    const [backendMessage, setBackendMessage] = useState("Loading message from backend...");
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchBackendMessage = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/message');

                const data = await response.json();
                setBackendMessage(data.message);
            } catch (error) {
                console.error("Error fetching message:", error);
                setBackendMessage("Failed to load message from backend.");
            }
        };

        fetchBackendMessage();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/students');
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }, []);
    return(
        <div>
            <Navbar/>
            <main style ={{padding: "20px", textAlign: "center", fontSize: "24px"}}>
                <h1>Welcome to Uniconnect </h1>
                <p>A unified digital ecosystem connecting all Ethiopian university students.</p>

                {/* Display message loaded from backend */}
                <section style={{marginTop: 24}}>
                    <strong>Backend Says:</strong>
                    <div style={{marginTop: 8, fontSize: 18}}>{backendMessage}</div>
                </section>

                {/* Students list */}
                <section style={{marginTop: 32, textAlign: 'left', maxWidth: 800, marginInline: 'auto'}}>
                    <h2 style={{fontSize: 28, textAlign: 'center'}}>Students</h2>
                    {Array.isArray(students) && students.length > 0 ? (
                        <ul style={{marginTop: 12, fontSize: 18, lineHeight: 1.6}}>
                            {students.map((s) => (
                                <li key={s.id ?? `${s.name}-${s.university}-${s.created_at}`}>
                                    <strong>{s.name}</strong>
                                    {` — ${s.university}`}
                                    {s.major ? `, ${s.major}` : ''}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{marginTop: 12, fontSize: 18, textAlign: 'center'}}>
                            No students yet. Add one via Thunder Client or curl, then refresh the page.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;