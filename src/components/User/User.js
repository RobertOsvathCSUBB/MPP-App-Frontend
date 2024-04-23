import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button }  from 'react-bootstrap';
import './User.css';
import AddUpdateModal from "../AddUpdateModal/AddUpdateModal";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const User = () => {
    const [users, setUsers] = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const index = users.findIndex((user) => user.id === id);
    const [state, setState] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://localhost:7182/api/User/${id}`);
                setState(res.data);
            } catch (err) {
                console.log('Error fetching data: ', err);
            }
        };
        fetchData();
    }, []);

    const [showModal, setShowModal] = useState(false);

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
        }
        catch (err) {
            console.log('Error updating user: ', err);
            window.alert('Error updating user');
            setUsers(users.map((user) => user.id === id ? prevState : user));
            setState(prevState);
        }
        setShowModal(false);
    }

    return (
        <>
        <Button variant="primary" onClick={() => navigate('/')}>Home</Button>
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
                    <Button variant="primary" onClick={() => navigate(`/user/${id}/loginActivities`)}>See login activities</Button>
                    <AddUpdateModal isOpen={showModal} onSubmit={handleUpdate} userState={users[index]} mode="Update" onClose={closeModal}/>
                </div>
            </div>
        </main>
        <footer>
            {index + 1}
        </footer>
        </>
    );
}

export default User;