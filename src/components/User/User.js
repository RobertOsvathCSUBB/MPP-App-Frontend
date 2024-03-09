import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function User({users}) {
    const { id } = useParams();

    const [state, setState] = useState(() => {
        return users.find((user) => user.id === id);
    });

    console.log("state: ", state);
    
    return (
        <div>
            <h1>{state.username}</h1>
            <p>ID: {state.id}</p>
            <img src={state.avatar} alt={state.username} />
            <p>Email: {state.email}</p>
            <p>Birth date: {state.birthdate.toDateString()}</p>
            <p>Registered at: {state.registeredAt.toDateString()}</p>
        </div>
    );
}