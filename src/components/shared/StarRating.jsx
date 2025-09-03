import { useState, useEffect } from "react";
import { EventService } from "../../services/eventService";
import axios from "axios";


const StarRating = ({ eventId, initialRating = 0, initialAverage = 0, onRated }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const [average, setAverage] = useState(initialAverage);

    useEffect(() => {
        const fetchRating = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/rating/events/${eventId}/rate`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRating(res.data.rating);
                setAverage(res.data.average);
            } catch (err) {
                console.error("Error al cargar calificación:", err);
            }
        };
        fetchRating();
    }, [eventId]);

    const handleClick = async (value) => {
        setRating(value);
        try {
            const token = localStorage.getItem('token'); // tu auth
            const res = await EventService.rate(eventId, value, token); // backend ya listo
            console.log("response backend", res);
            if (res.average) setAverage(res.average);
            if (onRated) onRated(res.average);
        } catch (err) {
            console.error("Error al calificar el evento:", err);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 5, marginTop: -5 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            cursor: "pointer",
                            color: star <= (hover || rating) ? "#FFD700" : "#ccc",
                            fontSize: 35
                        }}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleClick(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <small style={{ marginTop: 0, fontSize: 14, color: "#555", fontWeight: "bold", marginTop: -5 }}>Promedio: {average.toFixed(1)} ⭐</small>
        </div>
    );
};

export default StarRating;
