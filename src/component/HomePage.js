// implement logout
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../componentStyle/HomePage.css'; // Import the CSS file
import '../component/GlobalStyle.js'
import Axios from 'axios';
import { FaHeart } from 'react-icons/fa';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = () => {
    const [loginStatus, setLoginStatus] = useState('')
    Axios.defaults.withCredentials = true;
    const [movies, setMovies] = useState([]);
    const [searchMovie, setSearchMovie] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

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

        // Load movies
        // By setting withCredentials: true, cookies are included in the cross-origin requests. 
        // This ensures that the server can access the user's session data and maintain user authentication even after page refreshes. 
        // Previously, relying solely on the login session led to losing user authentication after a page refresh,
        // but using withCredentials now allows us to check for active cookies and retain the user's login state effectively.

        Axios.get('http://localhost:3000/movies', { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setMovies(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    showToast('Server Error', 'error');
                }
            });
    }, []);

    // Add movies to watchlist
    const handleClickMovie = (movieId, movieImage, movieTitle) => {
        // Make the POST request with the movieId as a parameter
        Axios.post('http://localhost:3000/addMovieToWatchList', {
            movieId: movieId,
            movieImage: movieImage,
            movieTitle: movieTitle,
            withCredentials: true
        })
            .then((response) => {
                if (response.status === 200) {
                    showToast('Movie added to watch list', 'success');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    showToast('Movie already in your watchlist', 'error');
                }
                else if (error.response.status === 401) {
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

    //search Async values might not uodate straight away, use a useEffect
    const search = () => {
        console.log(searchMovie)
        const headers = {
            'X-Search-Query': searchMovie
        };

        Axios.get('http://localhost:3000/searchMovie', { headers, withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setSearchResult(response.data)
                }
                // console.log(response.data);

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
                console.error(error);
            });
    };

    //Logout


    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <div>
                    <h1>Discover the World of Movies</h1>
                    <p>Explore our vast collection of movies and find your favorites.</p>
                </div>
            </header>

            <main className="homepage-main">
                <ToastContainer />
                <div className="search-container">
                    <input
                        type='text'
                        className='search-input-container'
                        name='search by genre'
                        placeholder="Search by genre"
                        onChange={(e) => {
                            setSearchMovie(e.target.value)
                        }}
                    />
                    <button className="search-button" id="searchButton" onClick={() => search()}>Search</button>
                </div>

                {searchResult.length === 0 && (
                    <div className="homepage-movie-list">
                        {movies.map(movie => (
                            <div key={movie.movie_id}>
                                <button className="homepage-movie-title-button" onClick={() => goToMoreInfo(movie.movie_id)}> <h2 className="homepage-movieTitle">{movie.title}</h2></button>
                                <div className="homepage-movie-image-container">
                                    <img className="homepage-images" src={movie.movie_image} alt={movie.title} />
                                    <button className="homepage-heart-icon-overlay" onClick={() => handleClickMovie(movie.movie_id, movie.movie_image, movie.title)}> <FaHeart className="homepage-heart-icon" /></button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
                <div className="homepage-search-list">
                    {searchResult.map(resultSearchMovie => (
                        <div key={resultSearchMovie.movie_id}>
                            <button className="homepage-movie-title-button" onClick={() => goToMoreInfo(resultSearchMovie.movie_id)}> <h2 className="homepage-movieTitle">{resultSearchMovie.title}</h2></button>
                            <div className="homepage-movie-image-container">
                                <img className="homepage-images" src={resultSearchMovie.movie_image} alt={resultSearchMovie.title} />
                                <button className="homepage-heart-icon-overlay-search" onClick={() => handleClickMovie(resultSearchMovie.movie_id, resultSearchMovie.movie_image, resultSearchMovie.title)}> <FaHeart className="homepage-heart-icon" /></button>
                            </div>

                        </div>
                    ))}
                </div>


            </main >


            <footer className="footer">
                <p>© 2023 Movie Database. All rights reserved.</p>
            </footer>
        </div >
    );
};

export default Homepage;


//do 400 errors/ error handling