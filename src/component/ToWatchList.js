import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../componentStyle/WatchList.css'; // Import the CSS file
import Axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToWatchList = () => {
    const [movies, setMovies] = useState([]);
    const [loginStatus, setLoginStatus] = useState('')
    const navigate = useNavigate();

    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

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



        Axios.get('http://localhost:3000/loadWatchList', { withCredentials: true })
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
                    showToast('Server Error', 'error');
                }
                else {
                    showToast('Unknown Error')
                }
            });
    }, []);

    const allMoviesWatchList = () => {
        Axios.get('http://localhost:3000/loadWatchList', { withCredentials: true })
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
                    showToast('Server Error', 'error');
                }
                else {
                    showToast('Unknown Error')
                }
            });
    };

    //when data needs passing as a param for server call, pass it as a param for a get request, for a post request you can send it through the body
    const goToMoreInfo = (movieId) => {
        // Use the movieId to fetch more information about the selected movie
        Axios.get('http://localhost:3000/selectedMovie/' + movieId, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    // Navigate to the MoreInfo page with the movieId as a parameter
                    navigate('/MoreInfo/' + movieId);
                }
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

    //Remove from watch list
    const removeFromWatchList = (movieId) => {
        console.log(movieId)
        // Use the movieId to fetch more information about the selected movie
        Axios.delete('http://localhost:3000/removeFromWatchList',
            {
                withCredentials: true,
                data: {
                    movieId: movieId
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    showToast("Movie removed", 'success');
                    allMoviesWatchList()
                }
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
        <div className="watchlist-container">
            <header className="watchlist-header">
                <h1>My Watch List</h1>
            </header>

            <main className="watchlist-main">
                <ToastContainer />
                <div className="watchlist-movie-list">
                    {movies.map(movie => (
                        <div key={movie.movie_id}>
                            <button className="watchlist-movieTitleButton" onClick={() => goToMoreInfo(movie.movie_id)}> <h2 className="watchlist-movieTitle">{movie.movie_title}</h2></button>
                            <div className="watchlist-movie-image-container">
                                <img className="images" src={movie.movie_image} alt={movie.title} />
                                <button onClick={() => removeFromWatchList(movie.movie_id)} className="watchlist-removeOverlay"><AiOutlineCloseCircle className="remove" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/HomePage" className="btn"><p className="btn-text"> Explore Movies</p></Link>
            </main>
            <footer className="footer">
                <p>© 2023 Movie Database. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ToWatchList;
