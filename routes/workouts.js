// routes/workouts.js
const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Require user to be logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("../users/login");
    }
    next();
};

// Show search form
router.get('/search', function (req, res, next) {
    res.render("search.ejs"); // update the text in search.ejs to talk about workouts
});

// Handle search results
router.get(
    '/search_result',
    [check('search_text').notEmpty()],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // if validation fails, just send them back to search
            return res.render('search.ejs', { errors: errors.array() });
        }

        const q = (req.query.search_text || '').trim();
        if (!q) {
            return res.redirect('/workouts/search');
        }

        // Search workouts by title (and optionally activity_type)
        const sql = `
            SELECT * FROM workouts 
            WHERE LOWER(title) LIKE LOWER(?) 
               OR LOWER(activity_type) LIKE LOWER(?)
        `;
        const param = '%' + q + '%';

        db.query(sql, [param, param], (err, result) => {
            if (err) return next(err);
            res.render('search_result.ejs', {
                workouts: result,
                searchTerm: q
            });
        });
    }
);

// List all workouts
router.get('/list', function (req, res, next) {
    const sqlquery = "SELECT * FROM workouts ORDER BY performed_at DESC";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableWorkouts: result });
    });
});

// Show add-workout form (protected)
router.get('/addworkout', redirectLogin, function (req, res, next) {
    res.render('addworkout.ejs');
});

// Handle workout submission (protected)
router.post(
    '/workoutadded',
    redirectLogin,
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('duration_minutes')
            .isInt({ gt: 0 })
            .withMessage('Duration must be a positive number')
    ],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("addworkout.ejs", { errors: errors.array() });
        }

        const title = req.sanitize(req.body.title);
        const activityType = req.sanitize(req.body.activity_type || '');
        const duration = parseInt(req.sanitize(req.body.duration_minutes || '0'), 10);
        const intensity = req.sanitize(req.body.intensity || '');
        const notes = req.sanitize(req.body.notes || '');
        const performedAt = req.sanitize(req.body.performed_at || new Date().toISOString().slice(0, 10));

        const sqlquery = `
            INSERT INTO workouts (title, activity_type, duration_minutes, intensity, notes, performed_at)
            VALUES (?,?,?,?,?,?)
        `;
        const newrecord = [title, activityType, duration, intensity, notes, performedAt];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) return next(err);
            res.send(
                `Workout added: ${title} (${activityType}), duration ${duration} minutes, intensity ${intensity}.`
            );
        });
    }
);

// “Short workouts” page that are less than 30 minutes long
router.get('/shortworkouts', function (req, res, next) {
    const sqlquery = `
        SELECT title, activity_type, duration_minutes, intensity, performed_at 
        FROM workouts 
        WHERE duration_minutes < 30
        ORDER BY performed_at DESC
    `;
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("shortworkouts.ejs", { shortWorkouts: result });
    });
});

module.exports = router;

// GET /workouts/stats - Protected page rendering the analytics dashboard. This page will fetch stats from the JSON API and render charts.
router.get('/stats', redirectLogin, function (req, res, next) {
    // Render the EJS view; client-side JS will call /api/workouts/stats
    res.render('workout_stats.ejs');
});
