import React,{ useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";



function EditStudentPage(){
    const { id }  = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [university, setUniversity] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const [message, setMessage] =useState('');



    useEffect(() => {
        const fetchStudent = async () => {
            try{
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/students/${id}`);

                if(!response.ok){
                    throw new Error(`Http error! status: ${response.status}`);
                }

                const data = await response.json();
                setName(data.name);
                setMajor(data.major);
                setUniversity(data.university);

            }catch(err){
                console.error("Failed to fetch student for edit", err);
                setError("Failed to load student data for editing.");
            }finally{
                setLoading(false);
            }
        };

        if(id){
            fetchStudent();
        }
    }, [id]);

// Handler for form submission (updating the student)

    const handleSubmit = async(e) => {
        e.preventDefault();
        setMessage('Updating the data...');

        try{
            const response = await fetch(`http://localhost:3000/api/students/${id}` ,{
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, major, university })
                });

                if(response.ok){
                    const updatedStudent = await response.json();
                    setMessage(`Student ${updatedStudent.name} updated successfully!`);

                    setTimeout(() => 
                    {
                        navigate('/students');
                    },2000);
                }else{
                    const errorData = await response.json();
                    setMessage(`Error: ${errorData.error || 'Failed to update student.'}`);
                }
        }catch(err){
            console.error('Network error or server down during update', err);
            setMessage('Error: Could not connect to the server for update.');
        }
    };

    if(loading){
        return <p style={{ textAlign: 'center', padding:'20px'}}>Loading student data .....</p>
    }

    if(error){
        return <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;
        }
        
        
    return(
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Edit Student Profile (ID: {id})</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name" style={{ display:'block', marginBottom: '5px', fontWeight: 'bold'}}>Student Name: </label>
                    <input type="text"
                           id="name"
                           value ={name}
                           onChange={e=>setName(e.target.value)}
                           required
                           style={{ width: '100%' , padding: '10px' , border: '1px solid #bdc3c7', borderRadius: '4px'}}
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
                        backgroundColor: '#2980b9', // A slightly different blue for edit
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    Update Student
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
        </div>
    );
}

export default EditStudentPage;