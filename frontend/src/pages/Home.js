import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import './Home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState({
        name: '',
        phone: '',
        gender: '',
        age: '',
        blood_group: '',
        type: '',
        email: ''
    });
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchMembers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${process.env.REACT_APP_API_URL}/get-members`;
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.get(url, { headers });
            setMembers(response.data.data.members);
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = `${process.env.REACT_APP_API_URL}/add-member`;
            const response = await axios.post(url, newMember, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                handleSuccess(response.data.message);
                setNewMember({
                    name: '',
                    phone: '',
                    gender: '',
                    age: '',
                    blood_group: '',
                    type: '',
                    email: ''
                });
                fetchMembers(); // Refresh the members list
                setShowForm(false); // Hide the form on success
            } else {
                handleError(response.data.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="container">
            <h1>Welcome, {loggedInUser}</h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>

            <button onClick={toggleForm} className="btn btn-primary mt-4">Add New Member</button>

            {showForm && (
                <div className="form-popup-overlay">
                    <div className="form-popup">
                        <button className="close-btn" onClick={toggleForm}>&times;</button>
                        <h3>Add New Member</h3>
                        <form onSubmit={handleAddMember}>
                            <div className="mb-2">
                                <input type="text" name="name" placeholder="Name" value={newMember.name} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="mb-2">
                                <input type="text" name="phone" placeholder="Phone" value={newMember.phone} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="mb-2">
                                <select name="gender" value={newMember.gender} onChange={handleInputChange} className="form-control" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <input type="number" name="age" placeholder="Age" value={newMember.age} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <div className="mb-2">
                                <input type="text" name="blood_group" placeholder="Blood Group" value={newMember.blood_group} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="mb-2">
                                <select name="type" value={newMember.type} onChange={handleInputChange} className="form-control" required>
                                    <option value="">Relation</option>
                                    <option value="child">Child</option>
                                    <option value="mother">Mother</option>
                                    <option value="father">Father</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <input type="email" name="email" placeholder="Email" value={newMember.email} onChange={handleInputChange} className="form-control" required />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Member</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Members Table */}
            <div className="card mt-4 p-3">
                <h3>Members List</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Blood Group</th>
                            <th>Relation</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.length > 0 ? (
                            members.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.age}</td>
                                    <td>{item.blood_group || 'N/A'}</td>
                                    <td>{item.type}</td>
                                    <td>{item.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;
