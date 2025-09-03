import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { es } from 'date-fns/locale';
import './EventCalendar.css';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const EventCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                const mappedEvents = res.data.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                }));
                setEvents(mappedEvents);
            } catch (err) {
                console.error('Error cargando eventos:', err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <>
            <h3>Calendario de eventos</h3>
            <div className='calendar-container' >
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                />
            </div>
        </>
    );
};

export default EventCalendar;
