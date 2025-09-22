import React, { useEffect, useMemo, useState } from 'react';
import { EventService } from '../../services/eventService';
import './AdminStats.css';

const StatCard = ({ title, value }) => (
    <div className="as-card">
        <div className="as-card-title">{title}</div>
        <div className="as-card-value">{value}</div>
    </div>
);

const BarChart = ({ title, items, valueKey, labelKey, maxValue }) => {
    const computedMax = useMemo(() => {
        if (typeof maxValue === 'number') return maxValue;
        return items.reduce((m, it) => Math.max(m, Number(it[valueKey] || 0)), 0) || 1;
    }, [items, valueKey, maxValue]);

    return (
        <div className="as-card">
            <h3 className="as-section-title">{title}</h3>
            <div className="as-barchart">
                {items.map((it) => {
                    const val = Number(it[valueKey] || 0);
                    const pct = Math.max(2, Math.round((val / computedMax) * 100));
                    return (
                        <div key={it.id} className="as-bar-row">
                            <div className="as-bar-label" title={it[labelKey]}>{it[labelKey]}</div>
                            <div className="as-bar-track">
                                <div className="as-bar-fill" style={{ width: pct + '%' }} />
                            </div>
                            <div className="as-bar-value">{val}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RatingChart = ({ title, items }) => {
    // Escalar en base 5 para promedio
    return (
        <div className="as-card">
            <h3 className="as-section-title">{title}</h3>
            <div className="as-barchart">
                {items.map((it) => {
                    const avg = Number(it.avgRating || 0);
                    const pct = Math.max(2, Math.round((avg / 5) * 100));
                    return (
                        <div key={it.id} className="as-bar-row">
                            <div className="as-bar-label" title={it.title}>{it.title}</div>
                            <div className="as-bar-track">
                                <div className="as-bar-fill as-bar-fill--rating" style={{ width: pct + '%' }} />
                            </div>
                            <div className="as-bar-value">{avg.toFixed(2)} ({it.ratingsCount})</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AdminStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await EventService.getAdminStats(token);
                setData(res);
            } catch (e) {
                setError('No se pudieron cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totals = data?.totals ?? { totalUsers: 0, totalEvents: 0, globalAverageRating: 0 };
    const categories = data?.categories ?? [];
    const topByViews = data?.topByViews ?? [];
    const topByFavorites = data?.topByFavorites ?? [];
    const topByRating = data?.topByRating ?? [];
    const topByComments = data?.topByComments ?? [];
    const usersByMonth = data?.trends?.usersByMonth ?? [];
    const eventsByMonth = data?.trends?.eventsByMonth ?? [];

    const categoriesData = useMemo(() => categories.map(c => ({ id: c.category, label: c.category, value: Number(c.count || 0) })), [categories]);
    const viewsData = useMemo(() => topByViews.map(e => ({ id: e.id, title: e.title, value: Number(e.viewsCount || 0) })), [topByViews]);
    const favsData = useMemo(() => topByFavorites.map(e => ({ id: e.id, title: e.title, value: Number(e.favoritesCount || 0) })), [topByFavorites]);
    const commentsData = useMemo(() => topByComments.map(e => ({ id: e.id, title: e.title, value: Number(e.commentsCount || 0) })), [topByComments]);
    const usersTrendData = useMemo(() => usersByMonth.map(r => ({ id: r.month, label: r.month, value: Number(r.count || 0) })), [usersByMonth]);
    const eventsTrendData = useMemo(() => eventsByMonth.map(r => ({ id: r.month, label: r.month, value: Number(r.count || 0) })), [eventsByMonth]);

    if (loading) return <div className="as-container">Cargando estadísticas...</div>;
    if (error) return <div className="as-container as-error">{error}</div>;

    return (
        <div className="as-container">
            <h1 className="as-title">Estadísticas de Eventos</h1>

            <div className="as-grid-cards">
                <StatCard title="Total de usuarios" value={totals.totalUsers} />
                <StatCard title="Total de administradores" value={totals.totalAdmins ?? 0} />
                <StatCard title="Total de eventos" value={totals.totalEvents} />
                <StatCard title="Eventos próximos" value={totals.upcomingEvents ?? 0} />
                <StatCard title="Eventos finalizados" value={totals.pastEvents ?? 0} />
                <StatCard title="Promedio rating global" value={(totals.globalAverageRating ?? 0).toFixed(2)} />
                <StatCard title="Total favoritos" value={totals.totalFavorites ?? 0} />
                <StatCard title="Total comentarios" value={totals.totalComments ?? 0} />
                <StatCard title="Total calificaciones" value={totals.totalRatings ?? 0} />
                <StatCard title="Prom. favoritos/evento" value={(totals.avgFavoritesPerEvent ?? 0)} />
                <StatCard title="Prom. comentarios/evento" value={(totals.avgCommentsPerEvent ?? 0)} />
                <StatCard title="Prom. calificaciones/evento" value={(totals.avgRatingsPerEvent ?? 0)} />
            </div>

            <div className="as-grid-charts">
                <BarChart
                    title="Top por vistas"
                    items={viewsData.map(x => ({ id: x.id, title: x.title, value: x.value }))}
                    valueKey="value"
                    labelKey="title"
                />
                <BarChart
                    title="Top por favoritos"
                    items={favsData.map(x => ({ id: x.id, title: x.title, value: x.value }))}
                    valueKey="value"
                    labelKey="title"
                />
                <BarChart
                    title="Top por comentarios"
                    items={commentsData.map(x => ({ id: x.id, title: x.title, value: x.value }))}
                    valueKey="value"
                    labelKey="title"
                />
                <RatingChart
                    title="Top por rating"
                    items={topByRating.map(e => ({ id: e.id, title: e.title, avgRating: Number(e.avgRating || 0), ratingsCount: e.ratingsCount }))}
                />
                <BarChart
                    title="Eventos por categoría"
                    items={categoriesData.map(c => ({ id: c.id, label: c.label, value: c.value }))}
                    valueKey="value"
                    labelKey="label"
                />

                <BarChart
                    title="Usuarios por mes (últimos 6)"
                    items={usersTrendData.map(x => ({ id: x.id, label: x.label, value: x.value }))}
                    valueKey="value"
                    labelKey="label"
                />
                <BarChart
                    title="Eventos por mes (últimos 6)"
                    items={eventsTrendData.map(x => ({ id: x.id, label: x.label, value: x.value }))}
                    valueKey="value"
                    labelKey="label"
                />
            </div>
        </div>
    );
};

export default AdminStats;


