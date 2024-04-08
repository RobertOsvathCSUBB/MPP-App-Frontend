import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

const BarChart = () => {
    const [users, setUsers] = useContext(UserContext);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [usersPerYear, setUsersPerYear] = useState([]);
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getUniqueYears = () => {
        const years = users.map((user) => new Date(user.registeredAt).getFullYear());
        return [...new Set(years)].sort();
    };

    const getNumberOfUsersPerYear = () => {
        const years = getUniqueYears();
        const usersPerYear = years.map((year) => {
            return users.filter((user) => new Date(user.registeredAt).getFullYear() === year).length;
        });
        return usersPerYear;
    };

    useEffect(() => {
        console.log(users);
        const x = getUniqueYears();
        const y = getNumberOfUsersPerYear();
        setUniqueYears(x);
        setUsersPerYear(y);
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