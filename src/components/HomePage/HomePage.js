import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddUpdateModal from '../AddUpdateModal/AddUpdateModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Col, Row, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faker, he } from '@faker-js/faker';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const api = axios.create({
  baseURL: 'https://localhost:7182/api/User'
});

const HomePage = () => {
  const value = useContext(UserContext);
  const {usersContext, currentPageContext, totalPages, healthStatusContext,
     usersAddedOfflineContext, usersDeletedOfflineContext, usersUpdatedOfflineContext} = useContext(UserContext);
  const [users, setUsers] = usersContext;
  const [currentPage, setCurrentPage] = currentPageContext;
  const [healthStatus, setHealthStatus] = healthStatusContext;
  const [usersAddedOffline, setUsersAddedOffline] = usersAddedOfflineContext;
  const [usersDeletedOffline, setUsersDeletedOffline] = usersDeletedOfflineContext;
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleAdd = async (newUser) => {
    setUsers([...users, newUser]);
    try {
      const res = await api.post('/', newUser);
      const newID = res.data.id;
      newUser.id = newID;
    }
    catch (err) {
      setUsersAddedOffline(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  const handleDelete = async (deletedUser) => {
    setUsers(users.filter((user) => user.id !== deletedUser.id));
    try {
      await api.delete(`/${deletedUser.id}`);
    }
    catch (err) {
      setUsersDeletedOffline(prev => [...prev, deletedUser]);
    }
  }

  const sortUsers = () => {
    const fetchData = async () => {
      try {
        const res = await api.get('/sorted');
        setUsers(res.data);
      } catch (err) {
        console.log('Error fetching data: ', err);
      }
    };
    fetchData();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [pageInput, setPageInput] = useState(currentPage.value + 1);

  const forwardPage = () => {
    setCurrentPage(prevPage => ({...prevPage, value: prevPage.value + 1, lastOperation: 'forward'}));
    setPageInput(prevPage => prevPage + 1);
  };

  const backwardPage = () => {
    setCurrentPage(prevPage => ({...prevPage, value: prevPage.value - 1, lastOperation: 'backward'}));
    setPageInput(prevPage => prevPage - 1);
  };

  const handlePageInputChanged = (e) => {
    setPageInput(e.target.value);
  };

  const setCustomPage = (e) => {
    if (e.code === 'Enter') {
      const value = e.target.value - 1;
      if (value >= 0 && value < totalPages) {
        setCurrentPage(prevPage => ({...prevPage, value: value, lastOperation: 'custom'}));
      }
      else {
        window.alert('Invalid page');
      }
    }
  };

  return (
    
    <div>
      {healthStatus === 'Unhealthy' && <div className="alert alert-danger" role="alert">Server is down</div>}
      <h1>Users</h1>
      <div id="add-button">
        <Button variant='primary' onClick={handleShowModal}>Add</Button>
        <Button variant='primary' onClick={sortUsers}>Sort</Button>
        <Button variant='primary' onClick={() => navigate('/chart')}>See chart based on registration year</Button>
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
              </Col>)
            )
          }
        </Row>
        <Row id="page-index">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', width: 'auto'}}>
              <p>Page 
                <FormControl style={{width: '75px'}} type='text' value={pageInput} onChange={handlePageInputChanged} onKeyDownCapture={setCustomPage}/>
              of {totalPages}</p>
            </div>
          </Col>
        </Row>
        <Row id="page-buttons">
          <Col>
            <Button variant="primary" onClick={backwardPage} disabled={currentPage.value === 0}>&lt;</Button>
            <Button variant="primary" onClick={forwardPage} disabled={currentPage.value === totalPages - 1}>&gt;</Button>
          </Col>
        </Row>
      </Container>
      <AddUpdateModal isOpen={showModal} onSubmit={handleAdd} userState={{
        id: '',
        username: '',
        email: '',
        password: '',
        avatar: faker.image.avatar(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
        loginActivities: []
      }} mode="Add" onClose={closeModal}/>
    </div>   

  );
}

export default HomePage;