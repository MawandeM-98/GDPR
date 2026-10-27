const express = require('express');
const controller = require('../controllers/requestController');

const router = express.Router();

router.get('/', controller.getRequests);
router.get('/:id', controller.getRequestById);
router.post('/', controller.createRequest);
router.patch('/:id', controller.updateRequest);

module.exports = router;