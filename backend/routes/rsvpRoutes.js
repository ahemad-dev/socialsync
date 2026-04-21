const express = require('express');
const router = express.Router();
const { getInvite, submitResponse, getEventResponses } = require('../controllers/rsvpController');


router.get('/:token', getInvite);
router.post('/:token', submitResponse);


router.get('/event/:eventId', getEventResponses);

module.exports = router;
