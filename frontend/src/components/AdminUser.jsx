import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import { GiSplitCross } from "react-icons/gi";
import { useCart } from '../context/CartProvider';
import TableLoader from '../components/TableLoader';

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });
    const { BASE_URL } = useCart();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/user`);
            setUsers(response.data);
            // Simulate minimum loading time of 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const overlay = document.getElementById('modelOverlay');

        if (showModal) {
            overlay.style.display = "block";
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = "none";
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSaveUser = async () => {
        try {
            await axios.post(`${BASE_URL}/addUser`, newUser);
            fetchUsers();
            setShowModal(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div>
            <h2>Users</h2>
            <div id="modelOverlay"></div>
            <div className="top-section">
                <button onClick={handleAddUser} className="add-btn">Add User</button>
            </div>
            
            {isLoading ? (
                <TableLoader rowsCount={5} />
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            {users.length > 0 && Object.keys(users[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                {Object.values(user).map((value, idx) => (
                                    <td key={idx}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setShowModal(false)}><GiSplitCross /></button>
                    <h2>Add User</h2>
                    <label>First Name</label>
                    <input type="text" name="firstName" value={newUser.firstName} onChange={handleInputChange} />
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={newUser.lastName} onChange={handleInputChange} />
                    <label>Email</label>
                    <input type="email" name="email" value={newUser.email} onChange={handleInputChange} />
                    <label>Password</label>
                    <input type="password" name="password" value={newUser.password} onChange={handleInputChange} />
                    <button onClick={handleSaveUser} className="save-btn">Save Changes</button>
                    <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminUser;