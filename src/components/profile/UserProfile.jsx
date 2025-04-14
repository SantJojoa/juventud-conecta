import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile, getFavoriteEvents } from "../../services/userService";
import { AuthService } from "../../services/authService";
import EventCard from "../shared/EventCard";
import EventPopup from "../shared/EventPopup"
import "./UserProfile.css";

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [errorFavorites, setErrorFavorites] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
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

                // Si existe una imagen de perfil, guardarla en localStorage para que esté disponible para el navbar
                if (userData.avatarUrl) {
                    localStorage.setItem('profileImage', userData.avatarUrl);
                }

                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    birthDate: userData.birthDate || '',
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
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                email: userProfile.email || '',
                phoneNumber: userProfile.phoneNumber || '',
                birthDate: userProfile.birthDate || '',
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
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

        if (formData.firstName !== userProfile.firstName && formData.firstName.trim() !== "") {
            updatedData.firstName = formData.firstName;
        }

        if (formData.lastName !== userProfile.lastName && formData.lastName.trim() !== "") {
            updatedData.lastName = formData.lastName;
        }

        if (formData.email !== userProfile.email && formData.email.trim() !== "") {
            updatedData.email = formData.email;
        }

        if (formData.phoneNumber !== userProfile.phoneNumber && formData.phoneNumber.trim() !== "") {
            updatedData.phoneNumber = formData.phoneNumber;
        }

        if (formData.birthDate !== userProfile.birthDate && formData.birthDate.trim() !== "") {
            updatedData.birthDate = formData.birthDate;
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
            const updatedProfile = await updateUserProfile(updatedData);
            setUserProfile({
                ...userProfile,
                ...updatedProfile
            });
            setSuccess("Perfil actualizado correctamente");
            setIsEditing(false);

            // Update localStorage if name changed
            if (updatedData.firstName || updatedData.lastName) {
                const fullName = `${updatedProfile.firstName || userProfile.firstName} ${updatedProfile.lastName || userProfile.lastName}`
                localStorage.setItem("userName", fullName);
            }

            // Trigger event to update other components that rely on user data
            window.dispatchEvent(new Event('login-change'));
        } catch (err) {
            setError(err.message || "Error al actualizar el perfil");
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <h2 className="profile-title">Mi Perfil</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {loading ? (
                    <div className="loading">Cargando perfil...</div>
                ) : !isEditing ? (
                    <div className="profile-info">
                        {userProfile?.avatarUrl && (
                            <div className="profile-image-container">
                                <img
                                    src={userProfile.avatarUrl}
                                    alt="Foto de perfil"
                                    className="profile-image"
                                />
                            </div>
                        )}
                        <div className="profile-field">
                            <span className="field-label">Nombre:</span>
                            <span className="field-value">{userProfile?.firstName} {userProfile?.lastName}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Email:</span>
                            <span className="field-value">{userProfile?.email}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Teléfono:</span>
                            <span className="field-value">{userProfile?.phoneNumber || "No especificado"}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Fecha de nacimiento:</span>
                            <span className="field-value">
                                {userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString() : "No especificado"}</span>
                        </div>
                        {userProfile?.role === 'admin' && (
                            <div className="profile-field">
                                <span className="field-label">Rol:</span>
                                <span className="field-value">{userProfile?.role}</span>
                            </div>
                        )}
                        <button className="edit-profile-btn" onClick={toggleEditMode}>
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        {userProfile?.avatarUrl && (
                            <div className="profile-image-container">
                                <img
                                    src={userProfile.avatarUrl}
                                    alt="Foto de perfil"
                                    className="profile-image"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="firstName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Nombre"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Apellido"
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
                        <div className="form-group">
                            <label htmlFor="phoneNumber"><i className="zmdi zmdi-phone"></i></label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Teléfono"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate"><i className="zmdi zmdi-calendar"></i></label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                placeholder="Fecha de nacimiento"
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
