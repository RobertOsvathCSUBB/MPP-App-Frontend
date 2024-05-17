import React from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
}
from 'mdb-react-ui-kit';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Register = () => {
    const {signedInContext, adminAccessTokenContext} = useContext(UserContext);
    const [signedIn, setSignedIn] = signedInContext;
    const [adminAccessToken, setAdminAccessToken] = adminAccessTokenContext

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate(); 

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleRegisterButtonDown = () => {
        if (password !== confirmPassword) {
            window.alert('Passwords do not match');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axios.post('https://localhost:7182/register', {
                    email: email,
                    password: password
                });
                console.log(res.data);
                navigate('/');
            }
            catch (err) {
                console.log('Error signing in: ', err);
                window.alert('Error signing in');
            }
        };
        fetchData();
    };
    

    return (
        <>
        <h1 className="text-center mb-5"><MDBIcon fas icon="user-lock" className="me-2" />Admin Register</h1>

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' onChange={handleEmailChange}/>
        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={handlePasswordChange}/>
        <MDBInput wrapperClass='mb-4' label='Confirm Password' id='form3' type='password' onChange={handleConfirmPasswordChange}/>

        <MDBBtn className="mb-4" onClick={handleRegisterButtonDown}>Sign in</MDBBtn>

        </MDBContainer>
        </>
    );
}

export default Register;