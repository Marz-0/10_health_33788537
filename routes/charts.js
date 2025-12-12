
const express = require('express');
const router = express.Router();

// GET /api/workouts/stats
// Returns grouped counts by month, activity_type, and intensity for Chart.js.
router.get('/workouts/stats', async function (req, res, next) {
    try {
        // SQL 1: Workouts per month (YYYY-MM key via DATE_FORMAT)
        const sqlByMonth = `
            SELECT DATE_FORMAT(performed_at, '%Y-%m') AS month, COUNT(*) AS total
            FROM workouts
            GROUP BY DATE_FORMAT(performed_at, '%Y-%m')
            ORDER BY DATE_FORMAT(performed_at, '%Y-%m') ASC
        `;

        // SQL 2: Workouts per activity type
        const sqlByType = `
            SELECT activity_type, COUNT(*) AS total
            FROM workouts
            GROUP BY activity_type
            ORDER BY total DESC
        `;

        // SQL 3: Workouts per intensity
        const sqlByIntensity = `
            SELECT intensity, COUNT(*) AS total
            FROM workouts
            GROUP BY intensity
            ORDER BY total DESC
        `;

        // Execute each query using the shared pool
        const byMonth = await new Promise((resolve, reject) => {
            db.query(sqlByMonth, (err, result) => {
                if (err) return reject(err);
                resolve(result || []);
            });
        });

        const byType = await new Promise((resolve, reject) => {
            db.query(sqlByType, (err, result) => {
                if (err) return reject(err);
                resolve(result || []);
            });
        });

        const byIntensity = await new Promise((resolve, reject) => {
            db.query(sqlByIntensity, (err, result) => {
                if (err) return reject(err);
                resolve(result || []);
            });
        });

        res.json({ byMonth, byType, byIntensity });
    } catch (err) {
        res.status(500).json({ error: 'Failed to load stats', details: String((err && err.message) || err) });
        return next(err);
    }
});

module.exports = router;
