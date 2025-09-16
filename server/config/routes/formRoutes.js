const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { publicGetFormByEvent, publicSubmitForm } = require('../controllers/eventFormController');

const router = express.Router();

router.get('/event/:eventId', publicGetFormByEvent);
router.post('/:formId/submit', authMiddleware, publicSubmitForm);

module.exports = router;