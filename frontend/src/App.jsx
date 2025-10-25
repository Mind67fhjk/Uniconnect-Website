import React from "react";
import Navbar from './components/Navbar';


function App(){
    return(
        <div>
            <Navbar/>
            <main style ={{padding: "20px", textAlign: "center", fontSize: "24px"}}>
                <h1>Wellcome to Uniconnect </h1>
                <p>A unified digital ecosystem connecting all Ethiopian university students.</p>
            </main>
        </div>
    );
}

export default App;