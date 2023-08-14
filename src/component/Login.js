import React, { useEffect, useState } from "react";
import "../componentStyle/Login.css"
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    Axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const goToSignUpPage = () => {
        navigate('/');
    };
    const goToHomePage = () => {
        navigate('../HomePage');
    };
    const handleLogin = (event) => {
        event.preventDefault();

        if (email === '') {
            showToast('Enter email', 'error');
            return;
        }
        if (password === '') {
            window.alert('Enter password');
            showToast('Enter password', 'error');
            return;
        }

        try {
            Axios.post('http://localhost:3000/login', {
                email: email,
                password: password
            }).then((response) => {

                if (response.status === 200) {
                    showToast('Success, User logged in!', 'success');
                    goToHomePage();
                }
            }).catch((error) => {
                if (error.response.status === 400) {
                    showToast('Incorrect email or password', 'error');
                }
                else if (error.response.status === 404) {
                    showToast('User doesnt exist', 'error');
                }
                else if (error.response.status === 500) {
                    showToast('Server Error', 'error');
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="login-container">
            {/* header - this is the top of the code */}
            <header className="login-header-container">
                <h2>Login</h2>
            </header>

            {/* main body of the code */}
            <main>
                <ToastContainer />
                <form className="login-form-container">
                    <div className="login-input-container">
                        <label className="login-label-container">Enter email:</label>
                        <br />
                        <input
                            type='text'
                            className='login-text-container'
                            name='email'
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                        <br />

                        <label className="login-label-container">Password:</label>
                        <br />
                        <input
                            type='password'
                            className='login-text-container'
                            name='password'
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />

                        <div className='login-submitButton'>
                            <button onClick={(event) => handleLogin(event)}>Submit</button>
                        </div>
                        <label onClick={goToSignUpPage}>Need an account</label>
                    </div>
                </form>

            </main>

            {/* bottom of the webpage */}
            <footer>Created by Adil</footer>
        </div>
    );
};

export default Login;

//if user cookies arent active send him to loginpage