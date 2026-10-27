const express = require('express');
const controller = require('../controllers/consentController');

const router = express.Router();

router.get('/', controller.getConsents);
router.post('/', controller.upsertConsent);

module.exports = router;