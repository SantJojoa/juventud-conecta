import React, { useEffect, useMemo, useState, useRef } from 'react';
import { EventService } from '../../services/eventService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

const COLORS = ['#3182ce', '#38a169', '#d69e2e', '#e53e3e', '#805ad5', '#dd6b20', '#2c7a7b', '#c05621'];

const PieChartCard = ({ title, data, dataKey, nameKey }) => {
    const hasData = data && data.length > 0 && data.some(item => item[dataKey] > 0);

    return (
        <div className="as-card as-pie-card">
            <h3 className="as-section-title">{title}</h3>
            {hasData ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry[nameKey]}: ${entry[dataKey]}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="as-no-data">No hay datos disponibles</div>
            )}
        </div>
    );
};

const AdminStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);
    const contentRef = useRef(null);

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

    const exportToPDF = async () => {
        if (!contentRef.current) return;
        
        setExporting(true);
        try {
            const element = contentRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;
            
            // Calcular cuántas páginas necesitamos
            const pageHeight = pdfHeight - 20;
            const totalPages = Math.ceil((imgHeight * ratio) / pageHeight);
            
            for (let i = 0; i < totalPages; i++) {
                if (i > 0) pdf.addPage();
                const yOffset = -(i * pageHeight);
                pdf.addImage(
                    imgData,
                    'PNG',
                    imgX,
                    imgY + yOffset,
                    imgWidth * ratio,
                    imgHeight * ratio
                );
            }
            
            const date = new Date().toLocaleDateString('es-CO');
            pdf.save(`estadisticas_${date}.pdf`);
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            alert('Error al generar el PDF. Por favor, intente de nuevo.');
        } finally {
            setExporting(false);
        }
    };

    const totals = data?.totals ?? { totalUsers: 0, totalEvents: 0, globalAverageRating: 0 };
    const categories = data?.categories ?? [];
    const topByViews = data?.topByViews ?? [];
    const topByFavorites = data?.topByFavorites ?? [];
    const topByRating = data?.topByRating ?? [];
    const topByComments = data?.topByComments ?? [];
    const usersByMonth = data?.trends?.usersByMonth ?? [];
    const eventsByMonth = data?.trends?.eventsByMonth ?? [];
    
    // Nuevas distribuciones
    const usersByRole = data?.distributions?.usersByRole ?? [];
    const eventsByStatus = data?.distributions?.eventsByStatus ?? [];
    const ratingDistribution = data?.distributions?.ratingDistribution ?? [];
    const userActivity = data?.distributions?.userActivity ?? [];
    const recentEvents = data?.recent?.recentEvents ?? [];

    const categoriesData = useMemo(() => categories.map(c => ({ id: c.category, label: c.category, value: Number(c.count || 0) })), [categories]);
    const viewsData = useMemo(() => topByViews.map(e => ({ id: e.id, title: e.title, value: Number(e.viewsCount || 0) })), [topByViews]);
    const favsData = useMemo(() => topByFavorites.map(e => ({ id: e.id, title: e.title, value: Number(e.favoritesCount || 0) })), [topByFavorites]);
    const commentsData = useMemo(() => topByComments.map(e => ({ id: e.id, title: e.title, value: Number(e.commentsCount || 0) })), [topByComments]);
    const usersTrendData = useMemo(() => usersByMonth.map(r => ({ id: r.month, label: r.month, value: Number(r.count || 0) })), [usersByMonth]);
    const eventsTrendData = useMemo(() => eventsByMonth.map(r => ({ id: r.month, label: r.month, value: Number(r.count || 0) })), [eventsByMonth]);
    
    // Datos para gráficos de pastel
    const pieUsersByRole = useMemo(() => usersByRole.map(r => ({ name: r.role, value: Number(r.count || 0) })), [usersByRole]);
    const pieEventsByStatus = useMemo(() => eventsByStatus.map(s => ({ name: s.status, value: Number(s.count || 0) })), [eventsByStatus]);
    const pieRatingDistribution = useMemo(() => ratingDistribution.map(r => ({ name: `${r.rating_level} estrellas`, value: Number(r.count || 0) })), [ratingDistribution]);
    const pieUserActivity = useMemo(() => userActivity.map(a => ({ name: a.activity, value: Number(a.count || 0) })), [userActivity]);

    if (loading) return <div className="as-container">Cargando estadísticas...</div>;
    if (error) return <div className="as-container as-error">{error}</div>;

    return (
        <div className="as-container">
            <div className="as-header">
                <h1 className="as-title">Estadísticas de Eventos</h1>
                <button 
                    className="as-export-btn" 
                    onClick={exportToPDF}
                    disabled={exporting}
                >
                    {exporting ? 'Generando PDF...' : '📄 Exportar a PDF'}
                </button>
            </div>

            <div ref={contentRef} className="as-content">
                <div className="as-grid-cards">
                <StatCard title="Total de usuarios" value={totals.totalUsers} />
                <StatCard title="Usuarios activos" value={totals.activeUsers ?? 0} />
                <StatCard title="Total de administradores" value={totals.totalAdmins ?? 0} />
                <StatCard title="Total de eventos" value={totals.totalEvents} />
                <StatCard title="Eventos próximos" value={totals.upcomingEvents ?? 0} />
                <StatCard title="Eventos finalizados" value={totals.pastEvents ?? 0} />
                <StatCard title="Promedio rating global" value={(totals.globalAverageRating ?? 0).toFixed(2)} />
                <StatCard title="Total interacciones" value={totals.totalInteractions ?? 0} />
                <StatCard title="Total favoritos" value={totals.totalFavorites ?? 0} />
                <StatCard title="Total comentarios" value={totals.totalComments ?? 0} />
                <StatCard title="Total calificaciones" value={totals.totalRatings ?? 0} />
                <StatCard title="Prom. favoritos/evento" value={(totals.avgFavoritesPerEvent ?? 0)} />
                <StatCard title="Prom. comentarios/evento" value={(totals.avgCommentsPerEvent ?? 0)} />
                <StatCard title="Prom. calificaciones/evento" value={(totals.avgRatingsPerEvent ?? 0)} />
            </div>

            {/* Gráficos de Pastel */}
            <h2 className="as-subtitle">Distribuciones</h2>
            <div className="as-grid-pie">
                <PieChartCard
                    title="Distribución de Usuarios por Rol"
                    data={pieUsersByRole}
                    dataKey="value"
                    nameKey="name"
                />
                <PieChartCard
                    title="Distribución de Eventos por Estado"
                    data={pieEventsByStatus}
                    dataKey="value"
                    nameKey="name"
                />
                <PieChartCard
                    title="Actividad de Usuarios"
                    data={pieUserActivity}
                    dataKey="value"
                    nameKey="name"
                />
                <PieChartCard
                    title="Distribución de Calificaciones"
                    data={pieRatingDistribution}
                    dataKey="value"
                    nameKey="name"
                />
            </div>

            {/* Gráficos de Barras */}
            <h2 className="as-subtitle">Rankings y Tendencias</h2>
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
        </div>
    );
};

export default AdminStats;


