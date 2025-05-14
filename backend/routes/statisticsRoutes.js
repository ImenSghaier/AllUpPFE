const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/admin/statistics', authMiddleware(['Administrateur']), getStatistics);

module.exports = router;
