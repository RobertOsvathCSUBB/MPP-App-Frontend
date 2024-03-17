import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button }  from 'react-bootstrap';
import './User.css';
import AddUpdateModal from "../AddUpdateModal/AddUpdateModal";

export default function User({users, handleUserUpdate}) {
    const { id } = useParams();

    const [state, setState] = useState(() => {
        return users.find((user) => user.id === id);
    });

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleUpdate = (updatedUser) => {
        setState(updatedUser);
        handleUserUpdate(updatedUser);
        setShowModal(false);
    }

    return (
        <><h1>{state.username}</h1>
        <main>
            <p>ID: {state.id}</p>
            <img src={state.avatar} alt={state.username} />
            <p>Email: {state.email}</p>
            <p>Birth date: {state.birthdate.toDateString()}</p>
            <p>Registered at: {state.registeredAt.toDateString()}</p>
            <Button variant="primary" onClick={handleShowModal}>Update</Button>
            <AddUpdateModal isOpen={showModal} onClose={handleUpdate} userState={state} />
        </main></>
    );
}