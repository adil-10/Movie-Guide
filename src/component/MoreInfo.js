// implement logout
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../componentStyle/MoreInfo.css';
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MoreInfo = () => {
    const [loginStatus, setLoginStatus] = useState('')
    const [movies, setMovies] = useState([]);
    Axios.defaults.withCredentials = true;

    // Navigate to sign-up page
    const navigate = useNavigate();
    const goToSignUpPage = () => {
        navigate('/');
    };

    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
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

        const url = window.location.href;
        var movieId = url.split('/')[4]
        Axios.get('http://localhost:3000/singleMovie/' + movieId, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setMovies(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    showToast("User session isn't active", 'error');
                }
                else if (error.response.status === 500) {
                    showToast("Server error", 'error');
                }
                else {
                    showToast("Unknown error", 'error');
                }
            });
    }, []);

    return (
        <div className="moreinfo-container">
            <header className="moreinfo-header">
                <div>
                    <h1>Discover the World of Movies</h1>
                    <p>Explore our vast collection of movies and find your favorites.</p>
                </div>
            </header>

            <main className="moreinfo-main">
                <ToastContainer />
                {movies.map(movie => (
                    <div className="moreinfo-movieContainer" key={movie.movie_id}>
                        <h2>{movie.title}</h2>
                        <div className="moreinfo-movieContainer1">
                            <img className="images" src={movie.movie_image} alt={movie.title} />

                            <p className="moreinfo-movieDesc">{movie.longDesc}</p>
                        </div>
                    </div>
                ))}
            </main >


            <footer className="footer">
                <p>© 2023 Movie Database. All rights reserved.</p>
            </footer>
        </div >
    );
};

export default MoreInfo;


//do 400 errors/ error handling