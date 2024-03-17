import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddUpdateModal = ({ isOpen, onClose, userState }) => {
    const [formData, setFormData] = useState({
        id: userState.id,
        username: '',
        email: '',
        password: '',
        avatar: userState.avatar,
        birthdate: userState.birthdate,
        registeredAt: userState.registeredAt
    });

    console.log('userState: ', userState);
    console.log('formData: ', formData);

    const handleChange = (e) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data: ', formData);
        onClose(formData);
    };

    return (
        <Modal show={isOpen}>
            <Modal.Header>
                <Modal.Title>Update user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='username'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type='text'
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='text'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='text'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {/* <Form.Group controlId='avatar'>
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control
                            type='image'
                            name='avatar'
                            accept='image/*'
                            value={formData.avatar}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId='birthdate'>
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                            type='date'
                            name='birthdate'
                            value={formData.birthdate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId='registeredAt'>
                        <Form.Label>Registered at</Form.Label>
                        <Form.Control
                            type='date'
                            name='registeredAt'
                            value={formData.registeredAt}
                            onChange={handleChange}
                        />
                    </Form.Group> */}
                    <Button variant='primary' type='submit' style={{ marginTop: '10px'}}>Update</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddUpdateModal;