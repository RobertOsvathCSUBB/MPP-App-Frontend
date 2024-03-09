import React, { useState } from 'react';
import './App.css';
import { faker } from '@faker-js/faker';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import User from '../../User';

export default function App() {
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
        <Route
          path="/"
          element={
            <div>
              <h1>Users</h1>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <Link to={`/user/${user.id}`}>{user.username}</Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route
          path="/user/:id"
          element={
            <User users={users}/>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}