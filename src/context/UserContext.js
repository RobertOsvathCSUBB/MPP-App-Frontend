import { createContext, useEffect, useState } from "react";
import axios from "axios";

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

    return (
        <UserContext.Provider value={[users, setUsers]}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, DataProvider };