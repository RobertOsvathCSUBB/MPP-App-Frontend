import { createContext, useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { sign } from "chart.js/helpers";

const PAGESIZE = 4;

const api = axios.create({
    baseURL: 'http://localhost:5194/api/User',
});

const UserContext = createContext();

const DataProvider = ({ children }) => {
    const [adminAccessToken, setAdminAccessToken] = useState('');
    const [signedIn, setSignedIn] = useState(() => {
        const storedToken = localStorage.getItem('adminAccessToken');
        if (storedToken) {
            setAdminAccessToken(storedToken);
            return true;
        }
        return false;
    });
    const [users, setUsers] = useState([]);
    const [previousUsers, setPreviousUsers] = useState([]);
    const [nextUsers, setNextUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState({
        value: 0,
        lastOperation: ''
    });
    const [emailName, setEmailName] = useState('');
    const [emailDomain, setEmailDomain] = useState('');

    const fetchData = async (page) => {
        try {
            const res = await api.get(`/pages?email=${emailName}&domain=${emailDomain}&page=${page}&pageSize=${PAGESIZE}`, {
                headers: {
                    'Authorization': `Bearer ${adminAccessToken}`
                }
            });
            return res.data;
        } catch (err) {
            console.log('Error fetching data: ', err);
        }
    };

    useEffect(() => {
        const onMount = async () => {
            const currentUsersAux = await fetchData(currentPage.value);
            setUsers(currentUsersAux);
            const nextUsersAux = await fetchData(currentPage.value + 1);
            setNextUsers(nextUsersAux);
            const totalUsers = (await api.get(`/totalUsersCount?email=${emailName}&domain=${emailDomain}`, {
                headers: {
                    'Authorization': `Bearer ${adminAccessToken}`
                }
            })).data;
            setTotalPages(Math.ceil(totalUsers / PAGESIZE));
        };
        console.log('Mounting, ', signedIn)
        if (signedIn) {
            onMount();
        }
    }, [signedIn]);

    useEffect(() => {
        const forward = async () => {
            setPreviousUsers(users);
            setUsers(nextUsers);
            if (currentPage.value < totalPages - 1) {
                const nextUsersAux = await fetchData(currentPage.value + 1);
                setNextUsers(nextUsersAux);
            }
            else {
                setNextUsers([]);
            }
        };
        const backward = async () => {
            setNextUsers(users);
            setUsers(previousUsers);
            if (currentPage.value > 0) {
                const previousUsersAux = await fetchData(currentPage.value - 1);
                setPreviousUsers(previousUsersAux);
            }
            else {
                setPreviousUsers([]);
            }
        };
        const custom = async () => {
            const currentUsersAux = await fetchData(currentPage.value);
            setUsers(currentUsersAux);
            if (currentPage.value > 0) {
                const previousUsersAux = await fetchData(currentPage.value - 1);
                setPreviousUsers(previousUsersAux);
            }
            else {
                setPreviousUsers([]);
            }
            if (currentPage.value < totalPages - 1) {
                const nextUsersAux = await fetchData(currentPage.value + 1);
                setNextUsers(nextUsersAux);
            }
            else {
                setNextUsers([]);
            }
        };
        const move = async () => {
            switch (currentPage.lastOperation) {
                case 'forward':
                    await forward();
                    break;
                case 'backward':
                    await backward();
                    break;
                case 'custom':
                    await custom();
                    break;
                default:
                    break;
            }
        };
        move();
    }, [currentPage]);

    // useEffect(() => {
    //     const connection = new signalR.HubConnectionBuilder().withUrl('https://localhost:7182/hub').build();
    //     connection.start()
    //         .then(() => {
    //             console.log('Connected to hub!');
    //             connection.on('ReceiveNewUser', (data) => {
    //                 const newUser = JSON.parse(data);
    //                 setUsers(prevUsers => [...prevUsers, newUser]);
    //             });
    //         })
    //         .catch(err => console.log('Error connecting: ', err));
    //     return () => connection.stop();
    // }, []);

    const [healthStatus, setHealthStatus] = useState('Unhealthy');
    const [usersAddedOffline, setUsersAddedOffline] = useState([]);
    const [usersDeletedOffline, setUsersDeletedOffline] = useState([]);
    const [usersUpdatedOffline, setUsersUpdatedOffline] = useState([]);
    const [triggerSync, setTriggerSync] = useState(false);

    const postUsersAddedOffline = async () => {
        try {
            const res = await api.post('/addRange', usersAddedOffline, {
                headers: {
                    'Authorization': `Bearer ${adminAccessToken}`
                }
            });
        }
        catch (err) {
            console.log('Error adding users offline: ', err);
        }
        setUsersAddedOffline([]);
    };

    const deleteUsersDeletedOffline = async () => {
        for (const user of usersDeletedOffline) {
            if (user.id === '') {
                setUsersDeletedOffline(prev => prev.filter(u => u.id !== user.id));
                continue;
            }
            try {
                await api.delete(`/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${adminAccessToken}`
                    }
                });
            } catch (err) {
                if (err.response) {
                    console.log('Error deleting user: ', err.response.data);
                } else {
                    console.log('Error deleting user: ', err.message);
                }
            }
        }
        setUsersDeletedOffline([]);
    };

    const putUsersUpdatedOffline = async () => {
        for (const user of usersUpdatedOffline) {
            try {
                await api.put(`/${user.id}`, user, {
                    headers: {
                        'Authorization': `Bearer ${adminAccessToken}`
                    }
                });
            } catch (err) {
                if (err.response) {
                    console.log('Error updating user: ', err.response.data);
                } else {
                    console.log('Error updating user: ', err.message);
                }
            }
        }
        setUsersUpdatedOffline([]);
    };

    useEffect(() => {
        const syncWithServer = async () => {
            console.log('Syncing with server...');
            await postUsersAddedOffline();
            await deleteUsersDeletedOffline();
            await putUsersUpdatedOffline();
        };
        if (triggerSync && signedIn) {
            syncWithServer();
        }
    }, [triggerSync]);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await axios.get('http://localhost:5194/_health');
                setHealthStatus(res.data.status);
                setTriggerSync(true);
            } catch (err) {
                setHealthStatus('Unhealthy');
                setTriggerSync(false);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <UserContext.Provider value={{
            usersContext: [users, setUsers],
            currentPageContext: [currentPage, setCurrentPage],
            totalPagesContext: [totalPages, setTotalPages],
            healthStatusContext: [healthStatus, setHealthStatus],
            usersAddedOfflineContext: [usersAddedOffline, setUsersAddedOffline],
            usersDeletedOfflineContext: [usersDeletedOffline, setUsersDeletedOffline],
            usersUpdatedOfflineContext: [usersUpdatedOffline, setUsersUpdatedOffline],
            signedInContext: [signedIn, setSignedIn],
            adminAccessTokenContext: [adminAccessToken, setAdminAccessToken],
            emailNameContext: [emailName, setEmailName],
            emailDomainContext: [emailDomain, setEmailDomain]
        }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, DataProvider };