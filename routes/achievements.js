// routes/achievements.js
const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Require user to be logged in for write actions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('../users/login');
  }
  next();
};

// Convenience redirect to list
router.get('/', (req, res) => {
  res.redirect('/achievements/list');
});

// List achievements
router.get('/list', (req, res, next) => {
  const sql = 'SELECT * FROM achievements ORDER BY achieved_at DESC, id DESC';
  db.query(sql, (err, rows) => {
    if (err) return next(err);
    res.render('achievements_list.ejs', { achievements: rows });
  });
});

// Show add achievement form
router.get('/add', redirectLogin, (req, res) => {
  res.render('achievements_add.ejs', { errors: [] });
});

// Handle add achievement
router.post(
  '/add',
  redirectLogin,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('metric_value')
      .optional({ checkFalsy: true, nullable: true })
      .isInt({ min: 0 })
      .withMessage('Metric value must be a positive number'),
    check('achieved_at')
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage('Date must be valid')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('achievements_add.ejs', { errors: errors.array() });
    }

    const title = req.sanitize(req.body.title || '');
    const description = req.sanitize(req.body.description || '');
    const category = req.sanitize(req.body.category || '');
    const metricValueRaw = req.body.metric_value;
    const metricValue = metricValueRaw ? parseInt(req.sanitize(metricValueRaw), 10) : null;
    const metricUnit = req.sanitize(req.body.metric_unit || '');
    const achievedAt = req.sanitize(
      req.body.achieved_at || new Date().toISOString().slice(0, 10)
    );
    const createdBy = req.session.username || null;

    const sql = `
      INSERT INTO achievements (title, description, category, metric_value, metric_unit, achieved_at, created_by)
      VALUES (?,?,?,?,?,?,?)
    `;
    const params = [title, description, category, metricValue, metricUnit, achievedAt, createdBy];

    db.query(sql, params, (err) => {
      if (err) return next(err);
      res.redirect('/achievements/list');
    });
  }
);

// Achievement report (totals, categories, best metrics, recent entries)
router.get('/report', (req, res, next) => {
  db.query('SELECT COUNT(*) AS total_count FROM achievements', (err, totalRows) => {
    if (err) return next(err);
    const totalCount = totalRows && totalRows[0] ? totalRows[0].total_count : 0;

    db.query(
      "SELECT COALESCE(category, 'Uncategorized') AS category, COUNT(*) AS count FROM achievements GROUP BY category ORDER BY count DESC",
      (err2, categoryRows) => {
        if (err2) return next(err2);

        db.query(
          'SELECT category, MAX(metric_value) AS best_value, MAX(metric_unit) AS metric_unit FROM achievements WHERE metric_value IS NOT NULL GROUP BY category, metric_unit ORDER BY category',
          (err3, bestRows) => {
            if (err3) return next(err3);

            db.query(
              'SELECT title, category, metric_value, metric_unit, achieved_at FROM achievements ORDER BY achieved_at DESC, id DESC LIMIT 10',
              (err4, recentRows) => {
                if (err4) return next(err4);

                res.render('achievements_report.ejs', {
                  summary: {
                    totalCount,
                    byCategory: categoryRows || []
                  },
                  bestMetrics: bestRows || [],
                  recentAchievements: recentRows || []
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
