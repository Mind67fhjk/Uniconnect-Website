import React from 'react';
import './Navbar.css';

function Navbar(){
    return(
        <nav className = "navbar">
            <div className = "navbar-brand">Uniconnect</div>
            <ul className='navbar-links'>
                <li><a href="#">Home</a></li>
                <li><a href="#">Academic</a></li>
                <li><a href="#">Social</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">Login</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;