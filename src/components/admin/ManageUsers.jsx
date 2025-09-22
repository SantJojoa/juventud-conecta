import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';
import { AdminUserService } from '../../services/adminUserService';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    const loadUsers = async () => {
        try {
            setLoading(true);
            setErr('');
            const token = AuthService.getToken();
            const data = await AdminUserService.list(token);
            setUsers(data);
        } catch (e) {
            setErr(e.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.');
        if (!confirm) return;
        try {
            const token = AuthService.getToken();
            await AdminUserService.delete(id, token);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            alert(e.message || 'No se pudo eliminar el usuario');
        }
    };

    if (loading) return <div className="state">Cargando usuarios...</div>;
    if (err) return <div className="state state--error">{err}</div>;

    return (
        <div className="manage-users">
            <div className="manage-users__header">
                <h1 className="manage-users__title">Gestionar Usuarios</h1>
                <div className="manage-users__actions">
                </div>
            </div>
            <div className="manage-users__card">
                {users.length === 0 ? (
                    <p>No hay usuarios registrados.</p>
                ) : (
                    <div className="manage-users__table-wrapper">
                        <table className="manage-users__table">
                            <thead className="manage-users__thead">
                                <tr>
                                    <th className="manage-users__th">Nombre</th>
                                    <th className="manage-users__th">Apellido</th>
                                    <th className="manage-users__th">Email</th>
                                    <th className="manage-users__th">Rol</th>
                                    <th className="manage-users__th">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="manage-users__tbody">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="manage-users__td">{u.firstName}</td>
                                        <td className="manage-users__td">{u.lastName}</td>
                                        <td className="manage-users__td">{u.email}</td>
                                        <td className="manage-users__td">{u.role}</td>
                                        <td className="manage-users__td">
                                            <button className="btn btn--danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;