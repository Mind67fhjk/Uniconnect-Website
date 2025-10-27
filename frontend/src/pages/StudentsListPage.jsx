import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback

function StudentsListPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(''); // New state for delete feedback

    // Use useCallback to memoize the fetchStudents function.
    // This is good practice when a function is passed as a dependency to useEffect
    // or other hooks, to prevent unnecessary re-renders or re-executions.
    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const response = await fetch('http://localhost:3000/api/students');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("Failed to load students. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []); // Dependencies for useCallback. Empty array means it's created once.

    // useEffect to fetch students when the component mounts
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]); // fetchStudents is a dependency now because it's wrapped in useCallback

    // NEW: Function to handle student deletion
    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) {
            return; // User cancelled deletion
        }

        setDeleteMessage('Deleting student...'); // Provide feedback
        try {
            const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
                method: 'DELETE', // Specify DELETE method
            });

            if (response.ok) {
                setDeleteMessage('Student deleted successfully!');
                // Refresh the student list after deletion
                fetchStudents();
            } else {
                const errorData = await response.json();
                setDeleteMessage(`Error: ${errorData.error || 'Failed to delete student.'}`);
            }
        } catch (err) {
            console.error('Network error during deletion:', err);
            setDeleteMessage('Error: Could not connect to the server for deletion.');
        } finally {
            // Clear delete message after a short delay
            setTimeout(() => setDeleteMessage(''), 3000);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>All Registered Students</h2>

            {loading && <p style={{ textAlign: 'center', color: '#3498db' }}>Loading students...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            {deleteMessage && <p style={{ textAlign: 'center', color: deleteMessage.startsWith('Error') ? 'red' : 'green' }}>{deleteMessage}</p>}

            {!loading && !error && students.length === 0 && (
                <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No students registered yet. <a href="/add-student">Add one now!</a></p>
            )}

            {!loading && !error && students.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {students.map(student => (
                        <li key={student.id} style={{
                            backgroundColor: '#f9f9f9',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#34495e' }}>{student.name}</h3>
                                <p style={{ margin: '0', color: '#7f8c8d' }}>
                                    <span style={{ fontWeight: 'bold' }}>Major:</span> {student.major} &bull;
                                    <span style={{ fontWeight: 'bold' }}> University:</span> {student.university}
                                </p>
                                <small style={{ color: '#95a5a6' }}>Registered: {new Date(student.created_at).toLocaleDateString()}</small>
                            </div>
                            <div>
                                {/* NEW Delete Button */}
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StudentsListPage;