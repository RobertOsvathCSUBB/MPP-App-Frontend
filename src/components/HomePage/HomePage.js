import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddUpdateModal from '../AddUpdateModal/AddUpdateModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const api = axios.create({
  baseURL: 'https://localhost:7182/api/User'
});

const HomePage = () => {
  const [users, setUsers] = useContext(UserContext);
  const [slicedUsers, setSlicedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setSlicedUsers(users.slice(page * 4, page * 4 + 4));
  }, [users, page]);

  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleAdd = async (newUser) => {
    setUsers([...users, newUser]);
    try {
      const res = await api.post('/', newUser);
    }
    catch (err) {
      setUsers(users.filter((user) => user.id !== newUser.id));
      if (err.response) {
        console.log('Error adding user: ', err.response.data);
      } else {
        console.log('Error adding user: ', err.message);
      }
      window.alert('Error adding user');
    }
    setShowModal(false);
  };

  const handleDelete = async (deletedUser) => {
    setUsers(users.filter((user) => user.id !== deletedUser.id));
    try {
      const res = await api.delete(`/${deletedUser.id}`);
    }
    catch (err) {
      setUsers([...users, deletedUser]);
      if (err.response) {
        console.log('Error deleting user: ', err.response.data);
      } else {
        console.log('Error deleting user: ', err.message);
      }
      window.alert('Error deleting user');
    }
  }

  const sortUsers = () => {
    setUsers((prevUsers) => {
      return prevUsers.sort((a, b) => {
        return a.username.localeCompare(b.username);
      });
    });
    navigate('/');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    
    <div>
      <h1>Users</h1>
      <div id="add-button">
        <Button variant='primary' onClick={handleShowModal}>Add</Button>
        <Button variant='primary' onClick={sortUsers}>Sort</Button>
        <Button variant='primary' onClick={() => navigate('/chart')}>See chart based on registration year</Button>
      </div>
      <Container fluid style={{alignItems: 'center'}}>
        <Row>
          {slicedUsers.map((user) => (
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
              </Col>)
            )
          }
        </Row>
        <Row id="page-buttons">
          <Col>
            <Button variant="primary" onClick={() => setPage((prevPage) => prevPage - 1)} disabled={page === 0}>&lt;</Button>
            <Button variant="primary" onClick={() => setPage((prevPage) => prevPage + 1)} disabled={(users.length % 4 === 0 && page === (users.length / 4) - 1 )||  page === Math.floor(users.length / 4)}>&gt;</Button>
          </Col>
        </Row>
      </Container>
      <AddUpdateModal isOpen={showModal} onSubmit={handleAdd} userState={{
        id: faker.string.uuid(),
        username: '',
        email: '',
        password: '',
        avatar: faker.image.avatar(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past()
      }} mode="Add" onClose={closeModal}/>
    </div>   

  );
}

export default HomePage;