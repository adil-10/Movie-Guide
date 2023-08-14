import React, { useState } from 'react';
import Axios from 'axios';
import "../componentStyle/SignUp.css";
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = props => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    const createAccount = (event) => {
        event.preventDefault();
        if (firstName === '') {
            // window.alert('Enter First name');
            showToast('Enter first name');
            return;
        }
        if (lastName === '') {
            // window.alert('Enter last name');
            showToast('Enter last name');
            return;
        }
        if (email === '') {
            // window.alert('Enter email');
            showToast('Enter email');
            return;
        }
        if (password === '') {
            // window.alert('Enter password');
            showToast('Enter password');
            return;
        }

        if (!/^[A-Za-z]+$/.test(firstName) || !/^[A-Za-z]+$/.test(lastName)) {
            // window.alert('First name or Last name is not valid');
            showToast('First name or Last name is not valid');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // window.alert('Enter a valid email');
            showToast('Enter a valid email');
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            // window.alert('Enter a valid password');
            showToast('Enter a valid password');
            return;
        }
        try {
            Axios.post('http://localhost:3000/api.insert', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
                .then((response) => {
                    console.log('Response received:', response);
                    if (response.status === 200) {
                        showToast('Success! User created', 'success');
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPassword('');
                    }
                })
                .catch((error) => {
                    showToast('Failed to create user', 'error');
                });
        } catch (error) {
            console.error(error);
        }
    }

    const goToLoginPage = () => {
        navigate('/Login');
    };

    return (
        <div className="container">
            {/* header - this is the top of the code */}
            <header className="signup-header-container">
                <h2>Welcome to ABDB</h2>
            </header>

            {/* main body of the code */}
            <main>
                <form className="signup-form-container">
                    <ToastContainer />
                    <div className="signup-input-container">
                        <label className="signup-label-container">Enter first Name:</label>
                        <br />
                        <input
                            type='text'
                            className='signup-text-container'
                            name='firstName'
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                        />
                        <br />

                        <label className='signup-label-container'>Enter surname:</label>
                        <br />
                        <input
                            type='text'
                            className='signup-text-container'
                            name='lastName'
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                        />
                        <br />

                        <label className='signup-label-container'>Enter email:</label>
                        <br />
                        <input
                            type='text'
                            className='signup-text-container'
                            name='email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />

                        <br />

                        <label className='signup-label-container'>Enter Password:</label>
                        <br />
                        <input
                            type='password'
                            className='signup-text-container'
                            name='password'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <div className='signup-submitButton'>
                            <button onClick={(event) => createAccount(event)}>Submit</button>
                        </div>
                        <label onClick={goToLoginPage}>Have an account?</label>
                    </div>
                </form>


            </main>

            {/* bottom of the webpage */}
            <footer className="footer">
                <p>© 2023 Movie Database. All rights reserved.</p>
            </footer>
        </div >
    );
};

export default SignUp;
