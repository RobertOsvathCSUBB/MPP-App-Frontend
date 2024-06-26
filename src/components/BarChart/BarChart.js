import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const BarChart = () => {
    const {adminAccessTokenContext} = useContext(UserContext);
    const [adminAccessToken, setAdminAccessToken] = adminAccessTokenContext;
    const [uniqueYears, setUniqueYears] = useState([]);
    const [usersPerYear, setUsersPerYear] = useState([]);
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5149/api/User/getUsersPerYear', {
                    headers: {
                        'Authorization': 'Bearer ' + adminAccessToken,
                    }
                });
                const data = res.data;
                setUniqueYears(data.map((item) => item.year));
                setUsersPerYear(data.map((item) => item.users));
            } catch (err) {
                console.log('Error fetching data: ', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setChartData({
            labels: uniqueYears,
            datasets: [
                {
                    label: 'Registered Users Per Year',
                    data: usersPerYear,
                    backgroundColor: ['turquoise'], 
                }
            ]
        });
        setIsLoading(false);
    }, [uniqueYears, usersPerYear]);

    return (
        (isLoading ? <p>Loading...</p> : <Bar data={chartData} />)
    );
};

export default BarChart;