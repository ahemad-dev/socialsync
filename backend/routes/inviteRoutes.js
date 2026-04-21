const express = require('express');
const router = express.Router();
const { sendInvites } = require('../controllers/inviteController');

router.post('/:id/invite', sendInvites); // POST /api/events/:id/invite

module.exports = router;
