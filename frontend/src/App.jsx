import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar';


function App(){

    const [backendMessage, setBackendMessage] = useState("Loading message from backend...");

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
            </main>
        </div>
    );
}

export default App;