
const express = require('express');
const router = express.Router();

// GET /api/workouts/stats
// Returns grouped counts by month, activity_type, and intensity for Chart.js.
// SQL uses YEAR()+MONTH() with CONCAT for broader MySQL compatibility across VMs.
router.get('/workouts/stats', async function (req, res, next) {
    try {
        // SQL 1: Workouts per month (YYYY-MM key using YEAR/MONTH and LPAD)
        const sqlByMonth = `
            SELECT 
              CONCAT(YEAR(performed_at), '-', LPAD(MONTH(performed_at), 2, '0')) AS month,
              COUNT(*) AS total
            FROM workouts
            WHERE performed_at IS NOT NULL
            GROUP BY YEAR(performed_at), MONTH(performed_at)
            ORDER BY YEAR(performed_at) ASC, MONTH(performed_at) ASC
        `;

        // SQL 2: Workouts per activity type
        const sqlByType = `
            SELECT COALESCE(NULLIF(TRIM(activity_type), ''), 'Unknown') AS activity_type,
                   COUNT(*) AS total
            FROM workouts
            GROUP BY COALESCE(NULLIF(TRIM(activity_type), ''), 'Unknown')
            ORDER BY total DESC
        `;

        // SQL 3: Workouts per intensity
        const sqlByIntensity = `
            SELECT COALESCE(NULLIF(TRIM(intensity), ''), 'unspecified') AS intensity,
                   COUNT(*) AS total
            FROM workouts
            GROUP BY COALESCE(NULLIF(TRIM(intensity), ''), 'unspecified')
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
        console.error('Stats API error:', err);
        res.status(500).json({ error: 'Failed to load stats', details: String((err && err.message) || err) });
        return next(err);
    }
});

module.exports = router;
