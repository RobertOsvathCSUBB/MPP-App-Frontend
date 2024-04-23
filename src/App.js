import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import User from './components/User/User';
import BarChart from './components/BarChart/BarChart';
import LoginActivities from './components/LoginActivities/LoginActivities';
import { DataProvider, UserContext } from './context/UserContext';

const App = () => {
    return (
        <BrowserRouter>
            <DataProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user/:id" element={<User />} />
                    <Route path="/chart" element={<BarChart />} />
                    <Route path="/user/:id/loginActivities" element={<LoginActivities />} />
                </Routes>
            </DataProvider>
        </BrowserRouter>
    );
};

export default App;