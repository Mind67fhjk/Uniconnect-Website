import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async(e)=>{
        e.preventDefault();
        setMessage('Logging in...');

        try{
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if(response.ok){
                const data = await response.json();
                setMessage(data.message);

                  // NEW: Store the JWT in localStorage
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('userEmail',data.user.email);
                  localStorage.setItem('userId', data.user.id);

                  setEmail('');// Clear email field
                  setPassword(''); // Clear password field

                  setTimeout(()=> navigate('/'),1500); // Redirect to home after login
                
            }else{
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error || 'Login failed.'}`);
            }
        } catch (error) {
            console.error('Network error or server down during login:', error);
            setMessage('Error: Could not connect to the server.');
        }
    };

     return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Login to Uniconnect</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#2980b9', // A different blue for login
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    Login
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;