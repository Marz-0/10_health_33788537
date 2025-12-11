// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// Middleware to protect routes
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('./login');
  }
  next();
};

// Helper to log login attempts in login_audit
function logLoginAttempt(identifier, success, reason, ip) {
  const sql = `
    INSERT INTO login_audit (identifier, success, reason, ip)
    VALUES (?,?,?,?)
  `;
  const params = [identifier, success ? 1 : 0, reason, ip || ''];
  db.query(sql, params, (err) => {
    if (err) {
      // Don't crash the app on audit failure, just log to console
      console.error('Error logging login attempt:', err);
    }
  });
}

// Registration

// Show registration form
router.get('/register', (req, res) => {
  res.render('register.ejs', { errors: [] });
});

// Handle registration
router.post(
  '/registered',
  [
    check('username')
      .notEmpty()
      .withMessage('Username is required'),
    check('first')
      .notEmpty()
      .withMessage('First name is required'),
    check('last')
      .notEmpty()
      .withMessage('Last name is required'),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain a lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain a number')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain a special character')
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    // If validation fails, re-render the form with error messages
    if (!errors.isEmpty()) {
      return res.status(400).render('register.ejs', { errors: errors.array() });
    }

    const username = req.sanitize(req.body.username || '');
    const first = req.sanitize(req.body.first || '');
    const last = req.sanitize(req.body.last || '');
    const email = req.sanitize(req.body.email || '');
    const plainPassword = req.body.password || '';

    const saltRounds = 10;

    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) return next(err);

      const sqlquery =
        'INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)';
      const newrecord = [username, first, last, email, hashedPassword];

      db.query(sqlquery, newrecord, (err2) => {
        if (err2) return next(err2);

        // You can also auto-log them in here if you like
        res.send(
          `Hello ${first} ${last}, you are now registered. <a href="/">Home</a>`
        );
      });
    });
  }
);

// Login

// Show login form
router.get('/login', (req, res) => {
  res.render('login.ejs', { errorMessage: null });
});

// Handle login
router.post(
  '/login',
  [
    check('identifier')
      .notEmpty()
      .withMessage('Please enter your username'),
    check('password')
      .notEmpty()
      .withMessage('Please enter your password')
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Show first validation error
      return res
        .status(400)
        .render('login.ejs', { errorMessage: errors.array()[0].msg });
    }

    const identifier = req.sanitize(req.body.identifier || '');
    const password = req.body.password || '';
    const ip = req.ip;

    const sql = 'SELECT id, username, hashedPassword FROM users WHERE username = ?';
    db.query(sql, [identifier], (err, results) => {
      if (err) return next(err);

      if (!results || results.length === 0) {
        logLoginAttempt(identifier, false, 'unknown username', ip);
        return res
          .status(401)
          .render('login.ejs', { errorMessage: 'Invalid username or password' });
      }

      const user = results[0];

      bcrypt.compare(password, user.hashedPassword, (err2, match) => {
        if (err2) return next(err2);

        if (!match) {
          logLoginAttempt(identifier, false, 'wrong password', ip);
          return res
            .status(401)
            .render('login.ejs', { errorMessage: 'Invalid username or password' });
        }

        // Success: set session and log audit
        req.session.userId = user.id;
        req.session.username = user.username;
        logLoginAttempt(identifier, true, 'login ok', ip);

        res.redirect('/');
      });
    });
  }
);

// Users list (protected)
router.get('/list', redirectLogin, (req, res, next) => {
  const sql = 'SELECT id, username, first, last, email FROM users';
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.render('userslist.ejs', { users: results });
  });
});

// Login audit (protected)
router.get('/audit', redirectLogin, (req, res, next) => {
  const sql = 'SELECT * FROM login_audit ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.render('users_audit.ejs', { audits: results });
  });
});

// Logout
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('./');
    }
    res.send('You are now logged out. <a href="/">Home</a>');
  });
});

module.exports = router;
