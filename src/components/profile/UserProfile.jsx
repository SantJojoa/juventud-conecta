import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { AuthService } from "../../services/authService";
import "./UserProfile.css";

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!AuthService.isAuthenticated()) {
                    navigate("/login");
                    return;
                }

                setLoading(true);
                const userData = await getUserProfile();
                setUserProfile(userData);
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } catch (err) {
                setError("Error al cargar el perfil: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        if (isEditing) {
            // Reset form data when canceling edit
            setFormData({
                name: userProfile.name,
                email: userProfile.email,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setError("");
            setSuccess("");
        }
        setIsEditing(!isEditing);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate password fields
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }

        // Only include fields that have changed and are not empty
        const updatedData = {};

        if (formData.name !== userProfile.name && formData.name.trim() !== "") {
            updatedData.name = formData.name.trim();
        }

        if (formData.email !== userProfile.email && formData.email.trim() !== "") {
            updatedData.email = formData.email.trim();
        }

        if (formData.currentPassword && formData.newPassword) {
            updatedData.currentPassword = formData.currentPassword;
            updatedData.newPassword = formData.newPassword;
        }

        // Only update if there are changes
        if (Object.keys(updatedData).length === 0) {
            setIsEditing(false);
            return;
        }

        try {
            const result = await updateUserProfile(updatedData);
            setUserProfile(result.user);
            setSuccess("Perfil actualizado correctamente");
            setIsEditing(false);

            // Update localStorage if name changed
            if (updatedData.name) {
                localStorage.setItem("userName", updatedData.name);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <h2 className="profile-title">Mi Perfil</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {!isEditing ? (
                    <div className="profile-info">
                        <div className="profile-field">
                            <span className="field-label">Nombre:</span>
                            <span className="field-value">{userProfile?.name}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Email:</span>
                            <span className="field-value">{userProfile?.email}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Rol:</span>
                            <span className="field-value">{userProfile?.role}</span>
                        </div>
                        <button className="edit-profile-btn" onClick={toggleEditMode}>
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nombre"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                            />
                        </div>

                        <h3 className="password-section-title">Cambiar Contraseña</h3>

                        <div className="form-group">
                            <label htmlFor="currentPassword"><i className="zmdi zmdi-lock"></i></label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Contraseña actual"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword"><i className="zmdi zmdi-lock-outline"></i></label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Nueva contraseña"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword"><i className="zmdi zmdi-lock-outline"></i></label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmar nueva contraseña"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={toggleEditMode}>
                                Cancelar
                            </button>
                            <button type="submit" className="save-btn">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserProfile;