// Load environment variables from .env
require('dotenv').config();

// Import express and ejs
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')));

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.username || null;
  next();
});


// Create an input sanitizer
app.use(expressSanitizer());

// Define our application-specific data
// (You can still use shopData in your EJS, just change the name shown)
app.locals.shopData = { shopName: "Health & Fitness Workout Tracker" };

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST || "localhost",
    user: process.env.HEALTH_USER || "health_app",
    password: process.env.HEALTH_PASSWORD || "qwertyuiop",
    database: process.env.HEALTH_DATABASE || "health",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Load the route handlers for /workouts (NEW – renamed from /books)
const workoutsRoutes = require('./routes/workouts');
app.use('/workouts', workoutsRoutes);

// Load the route handlers for /weather (unchanged)
const weatherRoutes = require('./routes/weather');
app.use('/weather', weatherRoutes);

// Load the route handlers for /achievements
const achievementsRoutes = require('./routes/achievements');
app.use('/achievements', achievementsRoutes);

// Load the route handlers for /api (updated below)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Load the route handlers for charts/stats API (separated for clarity)
const chartsRoutes = require('./routes/charts');
app.use('/api', chartsRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Health app listening on port ${port}!`));
