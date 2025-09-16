const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');

const {
    adminCreateOrUpdateForm,
    adminToggleOpen,
    adminListSubmissionsByEvent,
    adminSetSubmissionStatus,
} = require('../controllers/eventFormController');

const router = express.Router();

router.post('/forms/event/:eventId', isAdmin, adminCreateOrUpdateForm);
router.patch('/forms/:formId/toggle', isAdmin, adminToggleOpen);
router.get('/forms/event/:eventId/submissions', isAdmin, adminListSubmissionsByEvent);
router.patch('/forms/submissions/:submissionId', isAdmin, adminSetSubmissionStatus);

module.exports = router;