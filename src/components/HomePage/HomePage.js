import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddUpdateModal from '../AddUpdateModal/AddUpdateModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Col, Row, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faker} from '@faker-js/faker';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const api = axios.create({
  baseURL: 'http://localhost:5194/api/User'
});

const HomePage = () => {
  const {usersContext, currentPageContext, totalPagesContext, healthStatusContext,
     usersAddedOfflineContext, usersDeletedOfflineContext, adminAccessTokenContext, emailNameContext, emailDomainContext} = useContext(UserContext);
  const [users, setUsers] = usersContext;
  const [currentPage, setCurrentPage] = currentPageContext;
  const [totalPages, setTotalPages] = totalPagesContext;
  const [healthStatus, setHealthStatus] = healthStatusContext;
  const [usersAddedOffline, setUsersAddedOffline] = usersAddedOfflineContext;
  const [usersDeletedOffline, setUsersDeletedOffline] = usersDeletedOfflineContext;
  const [adminAccessToken, setAdminAccessToken] = adminAccessTokenContext;
  const [emailName, setEmailName] = emailNameContext;
  const [emailDomain, setEmailDomain] = emailDomainContext;
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminAccessToken');
    if (storedToken) {
      setAdminAccessToken(storedToken);
    }
    console.log(adminAccessToken);
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleAdd = async (newUser) => {
    if (users.length % 4 === 0) {
      setTotalPages(prevPages => prevPages + 1);
      await setCurrentPage(prevPage => ({...prevPage, value: prevPage.value + 1, lastOperation: 'forward'}));
      setPageInput(prevPage => prevPage + 1);
    }
    setUsers(prevUsers => [...prevUsers, newUser]);
    try {
      const res = await api.post(`?email=${emailName}&domain=${emailDomain}`, newUser, {
        headers: {
          'Authorization': `Bearer ${adminAccessToken}`
        }
      });
      const newID = res.data.id;
      newUser.id = newID;
      console.log(users);
    }
    catch (err) {
      setUsersAddedOffline(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  const handleDelete = async (deletedUser) => {
    if (users.length % 4 === 1 && currentPage.value > 0) {
      setTotalPages(prevPages => prevPages - 1);
      backwardPage();
    }
    setUsers(users.filter((user) => user.id !== deletedUser.id));
    try {
      await api.delete(`/${deletedUser.id}`, {
        headers: {
          'Authorization': `Bearer ${adminAccessToken}`
        }
      });
    }
    catch (err) {
      setUsersDeletedOffline(prev => [...prev, deletedUser]);
    }
  }

  const sortUsers = () => {
    window.alert('Sorting not available yet');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [pageInput, setPageInput] = useState(currentPage.value + 1);

  const forwardPage = () => {
    setCurrentPage(prevPage => ({...prevPage, value: prevPage.value + 1, lastOperation: 'forward'}));
    setPageInput(prevPage => parseInt(prevPage) + 1);
  };

  const backwardPage = () => {
    setCurrentPage(prevPage => ({...prevPage, value: prevPage.value - 1, lastOperation: 'backward'}));
    setPageInput(prevPage => parseInt(prevPage) - 1);
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
            <Button variant="primary" onClick={backwardPage} disabled={currentPage.value === 0 || healthStatus === 'Unhealthy'}>&lt;</Button>
            <Button variant="primary" onClick={forwardPage} disabled={currentPage.value === totalPages - 1 || healthStatus === 'Unhealthy'}>&gt;</Button>
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