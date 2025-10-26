import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after submission

function AddStudentPage() {
    // State to hold form input values
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [major, setMajor] = useState('');
    const [message, setMessage] = useState(''); // To display success or error messages
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Event handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission behavior

        setMessage('Submitting student data...'); // Give immediate feedback

        try {
            const response = await fetch('http://localhost:3000/api/students', {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Tell the server we're sending JSON
                },
                // Convert our state data into a JSON string to send
                body: JSON.stringify({ name, university, major }),
            });

            if (response.ok) { // Check if the response status is 200-299
                const newStudent = await response.json();
                setMessage(`Student '${newStudent.name}' added successfully!`);
                // Optionally clear form fields
                setName('');
                setUniversity('');
                setMajor('');
                // Redirect to the students list page after a short delay
                setTimeout(() => navigate('/students'), 2000);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error || 'Failed to add student.'}`);
            }
        } catch (error) {
            console.error('Network error or server down:', error);
            setMessage('Error: Could not connect to the server.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Add New Student</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Update state on input change
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label htmlFor="university" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>University:</label>
                    <input
                        type="text"
                        id="university"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label htmlFor="major" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Major:</label>
                    <input
                        type="text"
                        id="major"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    Add Student
                </button>
            </form>
            {/* Display messages */}
            {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
        </div>
    );
}

export default AddStudentPage;