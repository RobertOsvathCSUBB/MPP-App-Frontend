import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button }  from 'react-bootstrap';
import './User.css';
import AddUpdateModal from "../AddUpdateModal/AddUpdateModal";

export default function User({users, handleUserUpdate}) {
    const navigate = useNavigate();

    const { id } = useParams();

    console.log(id);

    const index = users.findIndex((user) => user.id === id);

    console.log(index);

    const [state, setState] = useState(() => {
        return users[index];
    });

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    }

    const handleUpdate = (updatedUser) => {
        setState(updatedUser);
        handleUserUpdate((prevUsers) => {
            return prevUsers.map((user) => {
                if (user.id === updatedUser.id) {
                    return updatedUser;
                }
                return user;
            });
        
        });
        setShowModal(false);
    }

    const handleGoToPrevious = () => {
        if (index === 0) {
            setState(users[users.length - 1]);
            navigate(`/user/${users[users.length - 1].id}`);
        } else {
            setState(users[index - 1]);
            navigate(`/user/${users[index - 1].id}`);
        }
    };

    const handleGoToNext = () => {
        if (index === users.length - 1) {
            setState(users[0]);
            navigate(`/user/${users[0].id}`);
        } else {
            setState(users[index + 1]);
            navigate(`/user/${users[index + 1].id}`);
        }
    };

    return (
        <><h1>{state.username}</h1>
        <main>
            <div>
                <Button variant="primary" onClick={handleGoToPrevious}>&lt;</Button>
            </div>
            <div id="center-container">
                <p>ID: {state.id}</p>
                <img src={state.avatar} alt={state.username} />
                <p>Email: {state.email}</p>
                <p>Birth date: {state.birthdate.toDateString()}</p>
                <p>Registered at: {state.registeredAt.toDateString()}</p>
                <Button variant="primary" onClick={openModal}>Update</Button>
                <AddUpdateModal isOpen={showModal} onSubmit={handleUpdate} userState={state} mode="Update" onClose={closeModal}/>
            </div>
            <div>
                <Button variant="primary" onClick={handleGoToNext}>&gt;</Button>
            </div>
        </main>
        <footer>
            {index + 1}
        </footer>
        </>
    );
}