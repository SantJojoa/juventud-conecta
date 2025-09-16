// src/components/forms/EventRegistrationForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormService } from '../../../services/formService';

const Field = ({ q, value, onChange }) => {
    if (q.type === 'textarea') return <textarea value={value} onChange={e => onChange(e.target.value)} />;
    if (q.type === 'number') return <input type="number" value={value} onChange={e => onChange(e.target.value)} />;
    if (q.type === 'date') return <input type="date" value={value} onChange={e => onChange(e.target.value)} />;
    if (q.type === 'email') return <input type="email" value={value} onChange={e => onChange(e.target.value)} />;
    if (q.type === 'url') return <input type="url" value={value} onChange={e => onChange(e.target.value)} />;
    if (q.type === 'select') {
        const opts = q.options?.options || [];
        return (
            <select value={value} onChange={e => onChange(e.target.value)}>
                <option value="">Selecciona...</option>
                {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
            </select>
        );
    }
    return <input value={value} onChange={e => onChange(e.target.value)} />;
};

const EventRegistrationForm = () => {
    const { id: eventId } = useParams();
    const [form, setForm] = useState(null);
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const f = await FormService.getFormByEvent(eventId);
                setForm(f);
                const init = {};
                (f.questions || []).forEach(q => { init[q.id] = ''; });
                setValues(init);
            } catch (e) {
                alert(e.message || 'Formulario no disponible');
            } finally {
                setLoading(false);
            }
        })();
    }, [eventId]);

    const submit = async () => {
        const answers = (form.questions || []).map(q => ({ questionId: q.id, value: values[q.id] ?? '' }));
        await FormService.submitForm(form.id, answers);
        alert('Inscripción enviada');
    };

    if (loading) return <div style={{ margin: '6rem auto', maxWidth: 800 }}>Cargando...</div>;
    if (!form) return <div style={{ margin: '6rem auto', maxWidth: 800 }}>Formulario no disponible.</div>;

    return (
        <div style={{ maxWidth: 800, margin: '6rem auto', padding: '0 1.5rem' }}>
            <h1>{form.title}</h1>
            <p>{form.description}</p>
            <div style={{ display: 'grid', gap: 12 }}>
                {form.questions?.map(q => (
                    <div key={q.id}>
                        <label>{q.label}{q.required ? ' *' : ''}</label>
                        <Field q={q} value={values[q.id] || ''} onChange={v => setValues({ ...values, [q.id]: v })} />
                    </div>
                ))}
                <button onClick={submit}>Enviar inscripción</button>
            </div>
        </div>
    );
};

export default EventRegistrationForm;