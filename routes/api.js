// routes/api.js
const express = require("express");
const router = express.Router();

// GET /api/workouts
router.get("/workouts", function (req, res, next) {
    let sqlquery = "SELECT * FROM workouts";
    let params = [];
    let conditions = [];

    // Text search on title or activity type
    if (req.query.search) {
        conditions.push("(title LIKE ? OR activity_type LIKE ?)");
        const like = "%" + req.query.search + "%";
        params.push(like, like);
    }

    // Min duration
    if (req.query.min_duration) {
        conditions.push("duration_minutes >= ?");
        params.push(req.query.min_duration);
    }

    // Max duration
    if (req.query.max_duration) {
        conditions.push("duration_minutes <= ?");
        params.push(req.query.max_duration);
    }

    // Filter by intensity
    if (req.query.intensity) {
        conditions.push("intensity = ?");
        params.push(req.query.intensity);
    }

    // Add WHERE clause if needed
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // Sorting: by title, duration or date
    if (req.query.sort) {
        const sortParam = req.query.sort;
        if (["title", "duration_minutes", "performed_at"].includes(sortParam)) {
            sqlquery += " ORDER BY " + sortParam;
        }
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            return next(err);
        }
        res.json(result);
    });
});

module.exports = router;
