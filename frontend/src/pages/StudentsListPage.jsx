import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentsListPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const navigate = useNavigate();

    const fetchStudents = useCallback(async () => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setError("You must be logged in to view students.");
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3000/api/protected-students', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error("Authentication failed. Please log in again.");
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setStudents(data.students || []);
        } catch (err) {
            console.error("Error fetching students:", err);
            setError(err.message || "Failed to load students. Please log in.");
            if (err.message === "Authentication failed. Please log in again.") {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleEdit = (studentId) => {
        navigate(`/edit-student/${studentId}`);
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setDeleteMessage('Error: Not authenticated.');
            setTimeout(() => setDeleteMessage(''), 3000);
            navigate('/login');
            return;
        }

        setDeleteMessage('Deleting student...');
        try {
            const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error('Authentication failed. Cannot delete.');
            }

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                throw new Error(errBody.error || `Delete failed (status ${response.status})`);
            }

            const result = await response.json();
            setDeleteMessage('Student deleted successfully.');
            // Refresh list
            await fetchStudents();
        } catch (err) {
            console.error('Error deleting student:', err);
            setDeleteMessage(err.message || 'Failed to delete student.');
        } finally {
            setTimeout(() => setDeleteMessage(''), 3000);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading students...</p>;
    if (error) return <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>All Registered Students</h2>

            {deleteMessage && <p style={{ textAlign: 'center', color: 'green' }}>{deleteMessage}</p>}

            {!loading && !error && students.length === 0 && (
                <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                    {localStorage.getItem('token') ? 'No students registered yet. ' : 'Please log in to add and view students. '}
                    <a href="/add-student">Add one now!</a>
                </p>
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
                            {localStorage.getItem('token') && (
                                <div>
                                    <button
                                        onClick={() => handleEdit(student.id)}
                                        style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StudentsListPage;