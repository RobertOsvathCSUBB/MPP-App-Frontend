import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Button } from 'react-bootstrap';

const LoginActivities = () => {
    const {usersContext, healthStatusContext, usersAddedOfflineContext, usersDeletedOfflineContext, usersUpdatedOfflineContext} = useContext(UserContext);
    const [users, setUsers] = usersContext;
    const id = useParams().id;
    const index = users.findIndex((user) => user.id === id);
    const [activities, setActivities] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setActivities(users.find((user) => user.id === id).loginActivities);
    }, []);

    return (
        <div>
            <Button variant="primary" onClick={() => navigate(`/user/${id}`)}>Back</Button>
            <h2>Login Activities</h2>
            <ul>
                {activities.map((activity, index) => (
                    <li key={index}>
                        <p>ID: {activity.id}</p>
                        <p>TIME: {activity.time}</p>
                        <p>IP ADDRESS: {activity.ip}</p>
                        <p>LATITUDE: {activity.latitude}</p>
                        <p>LONGITUDE: {activity.longitude}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LoginActivities;