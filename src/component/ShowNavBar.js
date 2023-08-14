import React from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ShowNavBar() {

    const location = useLocation();
    const hideNavBarPaths = ['/Login', '/']; // Add the paths where you want to hide the nav bar

    // Check if the current pathname is in the list of paths where the nav bar should be hidden
    const shouldHideNavBar = hideNavBarPaths.includes(location.pathname);

    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    const navigate = useNavigate();
    const goToSignUpPage = () => {
        navigate('/');
    };
    const handleLogout = () => {
        Axios.get('http://localhost:3000/api.logout', { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    showToast('User Logged out', 'success');
                    goToSignUpPage();
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    console.log('Logout failed')
                }
            });
    }

    if (shouldHideNavBar) {
        return null; // Don't render the nav bar
    }

    //otherwise return nav bar
    return (
        <header
            className="headerLinks"
            style={{
                display: "flex",
                paddingTop: "20px",
                paddingLeft: "20px",
                backgroundColor: '#f2f2f2'
            }}
        >
            <nav className="headerNavLinks">
                <div className="links" >

                    <NavLink to="/HomePage"
                        style={{
                            display: "inline-block",
                            paddingRight: "20px"
                        }}>HomePage</NavLink>

                    <NavLink to="/ToWatchList" style={{
                        display: "inline-block",
                        paddingRight: "20px"
                    }}> Watch List</NavLink>

                    <NavLink to="/UserInfo" style={{
                        display: "inline-block",
                        paddingRight: "20px"
                    }}>My Information</NavLink>

                    <NavLink to="/SignUp" onClick={() => handleLogout()}>LogOut</NavLink>
                </div>
            </nav>
        </header >
    );
}

export default ShowNavBar;

