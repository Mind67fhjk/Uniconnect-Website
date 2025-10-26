import React, { useState, useEffect } from 'react'; // Import useState and useEffect hooks

function StudentsListPage() {
    const [students, setStudents] = useState([]); // State to store the list of students
    const [loading, setLoading] = useState(true);  // State to manage loading status
    const [error, setError] = useState(null);      // State to store any error messages

    // useEffect hook to fetch students when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const response = await fetch('http://localhost:3000/api/students'); // Make GET request

                if (!response.ok) { // If response is not OK (e.g., 404, 500)
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json(); // Parse the JSON response
                setStudents(data); // Update the students state
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to load students. Please try again later."); // Set error state
            } finally {
                setLoading(false); // Set loading to false after fetch (whether success or error)
            }
        };

        fetchStudents(); // Call the fetch function
    }, []); // Empty dependency array means this effect runs only once after initial render

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>All Registered Students</h2>

            {loading && <p style={{ textAlign: 'center', color: '#3498db' }}>Loading students...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

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
                            {/* You could add edit/delete buttons here later */}
                            {/* <div>
                                <button style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                                <button style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </div> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StudentsListPage;