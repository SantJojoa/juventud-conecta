import React, { useEffect, useState } from 'react';
import { EventService } from '../../services/eventService';

const StatCard = ({ title, value }) => (
    <div style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        <div style={{ color: '#718096', fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#2d3748' }}>{value}</div>
    </div>
);

const ListTable = ({ title, rows, columns }) => (
    <div style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>{title}</h3>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #edf2f7', color: '#4a5568' }}>{c.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {columns.map((c) => (
                                <td key={c.key} style={{ padding: 8, borderBottom: '1px solid #f7fafc' }}>{row[c.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

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

    if (loading) return <div style={{ margin: '6rem auto', maxWidth: 1200, padding: '0 1.5rem' }}>Cargando estadísticas...</div>;
    if (error) return <div style={{ margin: '6rem auto', maxWidth: 1200, padding: '0 1.5rem', color: 'crimson' }}>{error}</div>;

    const { totals, categories, topByViews, topByFavorites, topByRating, topByComments } = data;

    return (
        <div style={{ maxWidth: 1200, margin: '6rem auto', padding: '0 1.5rem' }}>
            <h1 style={{ marginBottom: 24 }}>Estadísticas de Eventos</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
                <StatCard title="Total de usuarios" value={totals.totalUsers} />
                <StatCard title="Total de eventos" value={totals.totalEvents} />
                <StatCard title="Promedio de rating global" value={totals.globalAverageRating.toFixed(2)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <ListTable
                    title="Top por vistas"
                    rows={topByViews.map(e => ({ id: e.id, title: e.title, viewsCount: e.viewsCount }))}
                    columns={[{ key: 'title', label: 'Evento' }, { key: 'viewsCount', label: 'Vistas' }]}
                />

                <ListTable
                    title="Top por favoritos"
                    rows={topByFavorites.map(e => ({ id: e.id, title: e.title, favoritesCount: e.favoritesCount }))}
                    columns={[{ key: 'title', label: 'Evento' }, { key: 'favoritesCount', label: 'Favoritos' }]}
                />

                <ListTable
                    title="Top por rating"
                    rows={topByRating.map(e => ({ id: e.id, title: e.title, avgRating: Number(e.avgRating).toFixed(2), ratingsCount: e.ratingsCount }))}
                    columns={[{ key: 'title', label: 'Evento' }, { key: 'avgRating', label: 'Rating Prom.' }, { key: 'ratingsCount', label: 'Num. ratings' }]}
                />

                <ListTable
                    title="Top por comentarios"
                    rows={topByComments.map(e => ({ id: e.id, title: e.title, commentsCount: e.commentsCount }))}
                    columns={[{ key: 'title', label: 'Evento' }, { key: 'commentsCount', label: 'Comentarios' }]}
                />

                <ListTable
                    title="Top categorías por número de eventos"
                    rows={categories.map(c => ({ id: c.category, category: c.category, count: c.count }))}
                    columns={[{ key: 'category', label: 'Categoría' }, { key: 'count', label: 'Eventos' }]}
                />
            </div>
        </div>
    );
};

export default AdminStats;


