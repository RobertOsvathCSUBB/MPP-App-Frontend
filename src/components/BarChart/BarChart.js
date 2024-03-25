import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useState } from 'react';

const BarChart = ({data}) => {
    const getUniqueYears = (data) => {
        const years = data.map((user) => {
            return user.registeredAt.getFullYear();
        });
        return [...new Set(years)];
    };

    const getNumberOfUsersPerYear = (data) => {
        const years = getUniqueYears(data);
        const usersPerYear = years.map((year) => {
            return data.filter((user) => user.registeredAt.getFullYear() === year).length;
        });
        return usersPerYear;
    };

    const [chartData, setChartData] = useState({
        labels: getUniqueYears(data),
        datasets: [{
            label: 'Registration year',
            data: getNumberOfUsersPerYear(data),
            backgroundColor: ['turquoise'],
        }],
    });

    return (
        <Bar data={chartData} />
    );
};

export default BarChart;