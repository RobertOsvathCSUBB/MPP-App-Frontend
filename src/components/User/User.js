import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button }  from 'react-bootstrap';
import './User.css';
import AddUpdateModal from "../AddUpdateModal/AddUpdateModal";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import LoginActivities from "../LoginActivities/LoginActivities";

const User = () => {
    const {usersContext, healthStatusContext, usersUpdatedOfflineContext, adminAccessTokenContext} = useContext(UserContext);
    const [users, setUsers] = usersContext;
    const [healthStatus, setHealthStatus] = healthStatusContext;
    const [usersUpdatedOffline, setUsersUpdatedOffline] = usersUpdatedOfflineContext;
    const [adminAccessToken, setAdminAccessToken] = adminAccessTokenContext;
    const navigate = useNavigate();
    const { id } = useParams();
    const [state, setState] = useState(users.find((user) => user.id === id));

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5194/api/User/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + adminAccessToken,
                    }
                });
                setState(res.data);
            }
            catch (err) {
                setHealthStatus('Unhealthy');
                window.alert('Error fetching user');
            }
        };
        fetchData();
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    }

    const handleUpdate = async (updatedUser) => {
        const prevState = state;
        setUsers(users.map((user) => user.id === id ? updatedUser : user));
        setState(updatedUser);
        try {
            const res = await axios.put(`https://localhost:7182/api/User/${id}`, updatedUser);
            if (res.status === 400 || res.status === 404) {
                window.alert('Error updating user');
                console.log('Error updating user: ', res.data);
                setUsers(users.map((user) => user.id === id ? prevState : user));
                setState(prevState);
            }
        }
        catch (err) {
            setUsersUpdatedOffline(prev => [...prev, updatedUser]);
        }
        setShowModal(false);
    }

    return (
        <>
        {healthStatus === 'Unhealthy' && <div className="alert alert-danger" role="alert">Server is down</div>}
        <Button variant="primary" onClick={() => navigate('/home')}>Home</Button>
        <h1>{state.username}</h1>
        <main>
            <div id="main-container">
                <div id="center-container">
                    <p>ID: {state.id}</p>
                    <img src={state.avatar} alt={state.username} />
                    <p>Email: {state.email}</p>
                    <p>Birth date: {state.birthdate}</p>
                    <p>Registered at: {state.registeredAt}</p>
                    <Button variant="primary" onClick={openModal}>Update</Button>
                    <Button variant="primary" style={{marginTop: 20}} onClick={() => navigate(`/user/${id}/loginActivities`)}>See login activities</Button>
                    <AddUpdateModal isOpen={showModal} onSubmit={handleUpdate} userState={users.find((user) => user.id === id)} mode="Update" onClose={closeModal}/>
                </div>
            </div>
        </main>
        </>
    );
}

export default User;