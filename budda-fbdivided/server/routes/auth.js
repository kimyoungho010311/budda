const express = require('express');
const { handleGoogleAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/google', handleGoogleAuth);

module.exports = router;
