import React, { useState } from 'react';
import './App.css';
import { faker } from '@faker-js/faker';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import User from '../User/User';
import AddUpdateModal from '../AddUpdateModal/AddUpdateModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleAdd = (newUser) => {
    console.log('newUser: ', newUser);
    setUsers((prevUsers) => {
      return [...prevUsers, newUser];
    });
    setShowModal(false);
  };

  const handleUserUpdate = (updatedUser) => {
    console.log('got here');
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      });
    });
    console.log('users: ', users);
  };

  const handleDelete = (deletedUser) => {
    setUsers((prevUsers) => {
      return prevUsers.filter((user) => user.id !== deletedUser.id);
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Users</h1>
              <div id="add-button">
                <Button variant='primary' onClick={handleShowModal}>Add</Button>
              </div>
              <Container fluid style={{alignItems: 'center'}}>
                <Row>
                  {users.map((user) => (
                    <Col>
                      <Card style={{ width: '18rem', marginBottom: '20px' }}>
                        <Card.Img variant="top" src={user.avatar} />
                        <Card.Body>
                          <Card.Title>{user.username}</Card.Title>
                          <Link to={`/user/${user.id}`}>
                            <Button variant="primary">See details</Button>                            
                          </Link>
                          <Button variant="primary" style={{ marginLeft: '20px'}} onClick={() => handleDelete(user)}>Delete</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
              <AddUpdateModal isOpen={showModal} onClose={handleAdd} userState={{
                id: faker.string.uuid(),
                username: '',
                email: '',
                password: '',
                avatar: faker.image.avatar(),
                birthdate: faker.date.birthdate(),
                registeredAt: faker.date.past()
              }}/>
            </div>
          }
        />
        <Route
          path="/user/:id"
          element={
            <User users={users} handleUserUpdate={handleUserUpdate}/>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}