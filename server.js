// contains sql queries
// made with express and nodemon
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const mysql = require('mysql');

// hashing password
const bcrypt = require('bcrypt')
const saltRounds = 10

//
const session = require('express-session')
const cookieParser = require('cookie-parser');
const e = require('express');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'maptronikDatabase'
});

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userCookie",
    secret: "This is a test",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Remove the 'expires' option to make the cookie a session cookie
        // It will persist until the user closes the browser
        // expires: 60 * 60 * 24 * 24,
    }
}));


//signUp
app.post('/api.insert', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to hash password' });
        }

        const sqlInsert = "INSERT INTO user_information (first_name, last_name, email, password) VALUES (?,?,?,?)";
        db.query(sqlInsert, [firstName, lastName, email, hash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to insert user information' });
            }
            // You can also send a success message or user data back on successful sign-up
            return res.status(200).json({ message: 'User registration successful' });
        });
    });
});

// Login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sqlSelect = "SELECT * FROM user_information WHERE email = ?; ";

    db.query(sqlSelect, email, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Bcrypt error' });
                }
                if (response) {
                    req.session.user = result;
                    return res.status(200).json(result);
                } else {
                    return res.status(400).json({ message: "Wrong email, password combo" });
                }
            });
        } else {
            return res.status(404).json({ message: "User doesn't exist" });
        }
    });
});

// Login Status
app.get("/login", (req, res) => {
    if (req.session.user) {
        // res.send({ loggedIn: true, user: req.session.user });
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        return res.status(200).json({ loggedIn: false });
    }
});

//In the if statement request the cookie this way (req.cookies.userCookie)
app.get("/api.logout", (req, res) => {
    if (req.cookies.userCookie) {
        res.clearCookie("userCookie");
        return res.status(200).json({ user: req.session.user });
    }
    else {
        return res.status(400).json({ error: 'Logout failed' });
    }
})

//load all movies
app.get("/movies", (req, res) => {
    const sqlSelect = "SELECT * FROM movie_information";
    if (req.cookies.userCookie) {
        db.query(sqlSelect, (err, result) => {
            if (err) {
                // res.send({ error: err });
                return res.status(500).json({ error: err });
            } else {
                // res.send(result);
                return res.status(200).json(result);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't actvie" });
    }
});

//add movies to watch list
// POST request to insert data into a table with foreign key references
//add select statement to see if the movie is already in the db 

app.post("/addMovieToWatchList", (req, res) => {

    // Get user information from the session
    const userId = req.session.user[0].user_id;

    // Get movie details from the request body
    const movieId = req.body.movieId;
    const movieImage = req.body.movieImage;
    const movieTitle = req.body.movieTitle;

    // Convert the timestamp to a MySQL datetime format
    const dateAdded = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');

    // Check if the movie is already in the user's watch list
    const checkMovieQuery = 'SELECT * FROM user_to_watch_list WHERE user_id = ? AND movie_id = ?'
    if (req.cookies.userCookie) {
        db.query(checkMovieQuery, [userId, movieId], (err, watchListResults) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                // If the movie is already in the watch list, inform the user
                if (watchListResults.length > 0) {
                    return res.status(400).json({ error: 'User has already added this movie to their watch list' });
                } else {
                    // If the movie is not in the watch list, insert it
                    const sqlInsert = "INSERT INTO user_to_watch_list (user_id, movie_id, date_added, movie_image, movie_title) VALUES (?,?,?,?,?)"
                    db.query(sqlInsert, [userId, movieId, dateAdded, movieImage, movieTitle], (err, result) => {
                        if (err) {
                            // res.send({ error: err });
                            return res.status(500).json({ error: err });
                        } else {
                            return res.status(200).json(result);
                        }
                    });
                }
            }
        });
    }
    else {
        // User session is not active
        return res.status(401).json({ error: "User session isn't active" });
    }
});

//load all movies
app.get("/loadWatchList", (req, res) => {
    const userId = req.session.user[0].user_id;
    const sqlSelect = "SELECT * FROM user_to_watch_list WHERE user_id = ?";
    if (req.cookies.userCookie) {
        db.query(sqlSelect, [userId], (err, watchListResults) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                // res.send(watchListResults)
                return res.status(200).json(watchListResults);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});

//when data needs passing as a param for server call, pass it as a param for a get request, for a post request you can send it through the body
app.get("/selectedMovie/:movie_id", (req, res) => {
    const movieId = req.params.movie_id; // Get the movie_id from the URL parameter
    const sqlSelect = "SELECT * FROM movie_information WHERE movie_id = ?";
    if (req.cookies.userCookie) {
        db.query(sqlSelect, [movieId], (err, selectedMovie) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(selectedMovie);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});


app.get("/singleMovie/:movie_id", (req, res) => {
    const movieId = req.params.movie_id;
    const sqlSelect = "SELECT * FROM movie_information WHERE movie_id = ?";
    if (req.cookies.userCookie) {

        db.query(sqlSelect, [movieId], (err, selectedMovie) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(selectedMovie);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});


app.get("/searchMovie", (req, res) => {
    const query = req.headers['x-search-query']
    const sqlSelect = "SELECT * FROM movie_information WHERE genre = ?";
    if (req.cookies.userCookie) {
        db.query(sqlSelect, [query], (err, searchedMovie) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(searchedMovie);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});

app.get("/userData", (req, res) => {
    const userId = req.session.user[0].user_id;
    const sqlSelect = "SELECT * FROM user_information WHERE user_id = ?";
    if (req.cookies.userCookie) {
        db.query(sqlSelect, [userId], (err, userData) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(userData);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});

//patch
app.patch("/updateData", (req, res) => {
    const userId = req.session.user[0].user_id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const sqlUpdate = "UPDATE user_information SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?";

    if (req.cookies.userCookie) {
        db.query(sqlUpdate, [firstName, lastName, email, userId], (err, updateUserData) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(updateUserData);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});


app.delete("/removeFromWatchList", (req, res) => {
    const movieId = req.body.movieId;
    const userId = req.session.user[0].user_id;
    const sqlDelete = "DELETE FROM user_to_watch_list WHERE  user_id = ? AND movie_id=? ";
    if (req.cookies.userCookie) {
        db.query(sqlDelete, [userId, movieId], (err, movie) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            else {
                return res.status(200).json(movie);
            }
        });
    }
    else {
        return res.status(401).json({ error: "User session isn't active" });
    }
});
app.listen(3000, () => { console.log("server started on port 3000"); });



//do 400 errors etc 

