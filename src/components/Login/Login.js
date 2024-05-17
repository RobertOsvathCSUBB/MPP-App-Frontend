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

const Login = () => {
    const {signedInContext, adminAccessTokenContext} = useContext(UserContext);
    const [signedIn, setSignedIn] = signedInContext;
    const [adminAccessToken, setAdminAccessToken] = adminAccessTokenContext;
    const [email, setEmail] = useState(() => {
        const storedEmail = localStorage.getItem('email');
        return storedEmail ? storedEmail : '';
    });
    const [password, setPassword] = useState(() => {
        const storedPassword = localStorage.getItem('password');
        return storedPassword ? storedPassword : '';
    });

    const navigate = useNavigate(); 

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    };

    useEffect(() => {
        console.log('Email: ', email);
        console.log('Password', password);
    }, []);

    const handleSignInButtonDown = () => {
        console.log('here');
        const fetchData = async () => {
            try {
                const res = await axios.post('https://localhost:7182/login', {
                    email: email,
                    password: password,
                    twoFactorCode: "",
                    twoFactorRecoveryCode: ""
                });
                setAdminAccessToken(res.data.accessToken);
                setSignedIn(true);
                navigate('/home');
            }
            catch (err) {
                console.log('Error signing in: ', err);
                window.alert('Error signing in');
            }
        };
        fetchData();
    };

    const handleRememberMe = (e) => {
        if (e.target.checked) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('adminAccessToken', adminAccessToken);
        }
        else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('adminAccessToken');
        }
    };

    return (
        <>
        <h1 className="text-center mb-5"><MDBIcon fas icon="user-lock" className="me-2" />Admin Login</h1>

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' onChange={handleEmailChange}/>
        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={handlePasswordChange}/>

        <div className="d-flex justify-content-between mx-3 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' onClick={handleRememberMe}/>
            <a href='' onClick={() => alert('Too bad')}>Forgot password?</a>
        </div>

        <MDBBtn className="mb-4" onClick={handleSignInButtonDown}>Sign in</MDBBtn>

        <div className="text-center">
            <p>Not an admin? <a href="register">Register</a></p>
        </div>

        </MDBContainer>
        </>
    );
}

export default Login;