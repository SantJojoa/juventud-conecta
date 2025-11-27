const { Sequelize } = require('sequelize');
const { Event, EventForm, EventFormQuestion, EventFormSubmission, EventFormAnswer, User, Notification } = require('../models');

const adminCreateOrUpdateForm = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, isOpen, questions } = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ error: 'Evento no encontrado' });

        const [form] = await EventForm.findOrCreate({
            where: { eventId },
            defaults: { title, description, isOpen: isOpen ?? true },
        });

        await form.update({
            title: title ?? form.title,
            description: description ?? form.description,
            isOpen: typeof isOpen === 'boolean' ? isOpen : form.isOpen,
        });

        if (Array.isArray(questions)) {
            await EventFormQuestion.destroy({ where: { formId: form.id } });
            if (questions.length) {
                const row = questions.map(q => ({
                    formId: form.id,
                    label: q.label,
                    type: q.type,
                    required: q.required,
                    options: q.options || null,
                }));
                await EventFormQuestion.bulkCreate(row);
            }
        }

        const result = await EventForm.findOne({
            where: { id: form.id },
            include: [{ model: EventFormQuestion, as: 'questions' }]
        });
        res.json(result);
    } catch (e) {
        console.error('Error al crear o actualizar el formulario:', e);
        res.status(500).json({ error: 'Error al crear o actualizar el formulario' });
    }
};

const adminToggleOpen = async (req, res) => {
    try {
        const { formId } = req.params;
        const { isOpen } = req.body;
        const form = await EventForm.findByPk(formId);
        if (!form) return res.status(404).json({ error: 'Formulario no encontrado' });
        await form.update({ isOpen: !!isOpen });
        res.json(form);
    } catch (e) {
        console.error('Error al cambiar el estado del formulario:', e);
        res.status(500).json({ error: 'Error al cambiar el estado del formulario' });
    }
};

const adminListSubmissionsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const form = await EventForm.findOne({ where: { eventId } });
        if (!form) return res.json({ submissions: [] });

        const submissions = await EventFormSubmission.findAll({
            where: { formId: form.id },
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
                {
                    model: EventFormAnswer,
                    as: 'answers',
                    include: [{ model: EventFormQuestion, as: 'question', attributes: ['id', 'label', 'type'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ submissions });
    } catch (e) {
        console.error('Error al obtener las respuestas del formulario:', e);
        res.status(500).json({ error: 'Error al obtener las respuestas del formulario' });
    }
};

const adminSetSubmissionStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status } = req.body;
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        const submission = await EventFormSubmission.findByPk(submissionId);
        if (!submission) return res.status(404).json({ error: 'Respuesta no encontrada' });
        await submission.update({ status });
        const form = await EventForm.findByPk(submission.formId, {
            include: [{ model: Event, as: 'event' }]
        });
        await Notification.create({
            userId: submission.userId,
            type: 'submission_status',
            title: `Tu postulación fue ${status === 'accepted' ? 'aceptada' : status === 'rejected' ? 'rechazada' : 'actualizada'}`,
            message: `Tu postulación para el evento "${form?.event?.title || 'Desconocido'}" fue ${status === 'accepted' ? 'aceptada' : status === 'rejected' ? 'rechazada' : 'actualizada'}.`,
            meta: { formId: submission.formId, status }
        });
        res.json(submission);
    } catch (e) {
        console.error('Error al actualizar el estado de la respuesta:', e);
        res.status(500).json({ error: 'Error al actualizar el estado de la respuesta' });
    }
};

const publicGetFormByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const form = await EventForm.findOne({
            where: { eventId, isOpen: true },
            include: [{ model: EventFormQuestion, as: 'questions' }]
        });
        if (!form) return res.status(404).json({ error: 'Formulario no encontrado' });
        res.json(form);
    } catch (e) {
        console.error('Error al obtener el formulario:', e);
        res.status(500).json({ error: 'Error al obtener el formulario' });
    }
};

const publicSubmitForm = async (req, res) => {
    try {
        const { formId } = req.params;
        const userId = req.user.id;
        const { answers } = req.body;
        const form = await EventForm.findByPk(formId, { include: [{ model: EventFormQuestion, as: 'questions' }] });
        if (!form || !form.isOpen) return res.status(404).json({ error: 'Formulario cerrado o no encontrado' });

        const submission = await EventFormSubmission.create({ formId, userId, status: 'pending' });

        if (Array.isArray(answers) && answers.length) {
            const allowed = new Set(form.questions.map(q => q.id));
            const rows = answers
                .filter(a => allowed.has(a.questionId))
                .map(a => ({ submissionId: submission.id, questionId: a.questionId, value: String(a.value ?? '') }));
            if (rows.length) await EventFormAnswer.bulkCreate(rows);
        }
        const admins = await User.findAll({ where: { role: 'admin' }, attributes: ['id', 'firstName', 'lastName'] });
        const eventId = form.eventId;
        const notifs = admins.map(a => ({
            userId: a.id,
            type: 'new_submission',
            title: 'Nueva postulación',
            message: `Nuevo formulario enviado para el evento ${form.event.title}`,
            meta: { submissionId: submission.id, formId, eventId }
        }));
        if (notifs.length) await Notification.bulkCreate(notifs);
        res.status(201).json({ message: 'Formulario enviado correctamente', submissionId: submission.id });
    } catch (e) {
        console.error('Error al enviar el formulario:', e);
        res.status(500).json({ error: 'Error al enviar el formulario' });
    }
};



module.exports = {
    adminCreateOrUpdateForm,
    adminToggleOpen,
    adminListSubmissionsByEvent,
    adminSetSubmissionStatus,
    publicGetFormByEvent,
    publicSubmitForm,
};

