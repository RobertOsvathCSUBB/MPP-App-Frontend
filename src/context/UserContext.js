import { createContext, useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const UserContext = createContext([]);

const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://localhost:7182/api/User');
                setUsers(res.data);
            } catch (err) {
                console.log('Error fetching data: ', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder().withUrl('https://localhost:7182/hub').build();
        connection.start()
            .then(() => {
                console.log('Connected to hub!');
                connection.on('ReceiveNewUser', (data) => {
                    const newUser = JSON.parse(data);
                    setUsers(prevUsers => [...prevUsers, newUser]);
                });
            })
            .catch(err => console.log('Error connecting: ', err));
        return () => connection.stop();
    }, []);

    const [healthStatus, setHealthStatus] = useState('Unhealthy');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await axios.get('https://localhost:7182/_health');
                setHealthStatus(res.data.status);
            } catch (err) {
                setHealthStatus('Unhealthy');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <UserContext.Provider value={[users, setUsers]}>
            {healthStatus === 'Healthy' ? children : <p>Service is down!</p>}
        </UserContext.Provider>
    );
};

export { UserContext, DataProvider };