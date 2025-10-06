// hooks/useEventForm.js
import { useState } from 'react';

export const useEventForm = (initialData = {}) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        imageSrc: initialData.imageSrc || '',
        description: initialData.description || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        location: initialData.location || '',
        category: initialData.category || '',
    });
    const [invalidFields, setInvalidFields] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (invalidFields[name]) {
            setInvalidFields({ ...invalidFields, [name]: false });
        }
    };

    const validateForm = () => {
        const newInvalidFields = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            if (!formData[field]) {
                newInvalidFields[field] = true;
                isValid = false;
            } else {
                newInvalidFields[field] = false;
            }
        });

        setInvalidFields(newInvalidFields);
        return isValid;
    };


    const resetForm = () => {
        setFormData({
            title: '',
            imageSrc: '',
            description: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            location: '',
            category: '',
        });
        setInvalidFields({});
    };

    return { formData, invalidFields, handleChange, validateForm, setFormData, resetForm, setInvalidFields };
};