import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Button } from 'react-bootstrap';
import axios from "axios";
import { faker} from '@faker-js/faker';

const LoginActivities = () => {
    const {usersContext, healthStatusContext} = useContext(UserContext);
    const [users, setUsers] = usersContext;
    const [healthStatus, setHealthStatus] = healthStatusContext;
    const id = useParams().id;
    const index = users.findIndex((user) => user.id === id);
    const [activities, setActivities] = useState(Array.from(users[index].loginActivities));

    const navigate = useNavigate();

    useEffect(() => {
        setActivities(users.find((user) => user.id === id).loginActivities);
    }, []);

    const handleAddActivity = () => {
        const prevActivity = activities;
        const newActivity = {
            id: '',
            time: faker.date.recent(),
            ip: faker.internet.ip(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            userId: id
        };
        const fetchData = async () => {
            try {
                const res = await axios.post(`https://localhost:7182/api/User/${id}/loginActivity`, newActivity);
                const newID = res.data.id;
                const newUserID = res.data.userId;
                newActivity.id = newID;
                newActivity.userId = newUserID;
                newActivity.time = newActivity.time.toISOString();
                console.log(newActivity);
                const newActivities = [...prevActivity, newActivity];
                console.log(activities);
                console.log(newActivities);
                setActivities(newActivities);
            }
            catch (err) {
                console.log('Error adding activity: ', err.message);
                window.alert('Error adding activity');
            }
        };
        fetchData();
    };

    return (
        <div>
            {healthStatus === 'Unhealthy' && <div className="alert alert-danger" role="alert">Server is down</div>}
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
            <Button variant="primary" onClick={handleAddActivity}>Add Activity</Button>
        </div>
    );
};

export default LoginActivities;