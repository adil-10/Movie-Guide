// implement logout
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../componentStyle/userInfo.css';
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserInfo = () => {
    const [loginStatus, setLoginStatus] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    Axios.defaults.withCredentials = true;


    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };
    // Navigate to sign-up page
    const navigate = useNavigate();
    const goToSignUpPage = () => {
        navigate('/');
    };

    useEffect(() => {
        Axios.get("http://localhost:3000/login", { withCredentials: true })
            .then((response) => {
                if (response.data.loggedIn === true) {
                    setLoginStatus(response.data.user[0].email);
                } else if (response.data.loggedIn === false) {
                    setLoginStatus('User not logged in');
                    goToSignUpPage();
                }
            })
            .catch((error) => {
                console.error(error);
            });


        Axios.get('http://localhost:3000/userData', { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setFirstName(response.data[0].first_name);
                    setLastName(response.data[0].last_name);
                    setEmail(response.data[0].email);
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        showToast("User session isn't active", 'error');
                    }
                    else if (error.response.status === 500) {
                        showToast('Server Error', 'error');
                    }
                    else {
                        showToast('Unknown Error', 'error');
                    }
                }
                else {
                    console.error(error);
                }
            });

    }, []);

    //update userdata
    const updateData = () => {
        const updatedFirstName = firstName;
        const updatedLastName = lastName;
        const updatedEmail = email;
        Axios.patch('http://localhost:3000/updateData', {
            firstName: updatedFirstName,
            lastName: updatedLastName,
            email: updatedEmail,
        },
            { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    showToast('User data updated', 'success');
                }
                console.log(response)
            })
            .catch((error) => {

                if (error.response.status === 401) {
                    showToast("User session isn't active", 'error');
                }
                else if (error.response.status === 500) {
                    showToast('Server Error', 'error');
                }
                else {
                    showToast('Unknown Error', 'error');
                }
            });
    };
    return (
        <div className="userData-container">
            <header className="userData-header">
                <div>
                    <h1>Discover the World of Movies</h1>
                    <p>Explore our vast collection of movies and find your favorites.</p>
                </div>
            </header>

            <main className="userData-main">
                <ToastContainer />
                <div className="userData-input-container">

                    <input
                        type='text'
                        className='input-container'
                        value={firstName}
                        name='first-name'
                        onChange={(e) => {
                            setFirstName(e.target.value)
                        }
                        }
                    />
                    <br />
                    <input
                        type='text'
                        className='input-container'
                        name='last-name'
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value)
                        }
                        }
                    />
                    <br />
                    <input
                        type='text'
                        className='input-container'
                        name='email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }
                        }
                    />
                    <br />
                    <button onClick={updateData}>submit</button>
                </div>
            </main >


            <footer className="footer">
                <p>© 2023 Movie Database. All rights reserved.</p>
            </footer>
        </div >
    );
};

export default UserInfo;


//do 400 errors/ error handling