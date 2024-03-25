import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import User from './User/User';
import BarChart from './BarChart/BarChart';
import { faker } from '@faker-js/faker';

const App = () => {
    const [users, setUsers] = useState(() => {
        return Array.from({ length: 10 }, () => {
          return {
            id: faker.string.uuid(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            avatar: faker.image.avatar(),
            birthdate: faker.date.birthdate(),
            registeredAt: faker.date.past()
          };
        });
      });

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage users={users} setUsers={setUsers}/>} />
                <Route path="/user/:id" element={<User users={users} handleUserUpdate={setUsers}/>} />
                <Route path="/chart" element={<BarChart data={users}/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;