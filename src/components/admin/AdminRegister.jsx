import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../login/Login.css";
import "../login/fonts/material-icon/css/material-design-iconic-font.min.css";

const AdminRegister = () => {
    // Estado para manejar los pasos del formulario
    const [currentStep, setCurrentStep] = useState(1);

    // Datos personales (paso 1)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
    const [isBirthDateEmpty, setIsBirthDateEmpty] = useState(false);

    // Datos de contacto y acceso (paso 2)
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);

    // Foto de perfil (paso 3)
    const [avatar, setAvatar] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Verificar si el usuario tiene permisos de administrador
    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        const token = localStorage.getItem("token");

        if (!token || userRole !== "admin") {
            Swal.fire({
                icon: 'error',
                title: 'Sin autorización',
                text: 'Necesitas iniciar sesión como administrador para registrar otros administradores.',
                confirmButtonText: 'Volver al inicio',
                confirmButtonColor: '#d63031'
            }).then(() => {
                navigate('/');
            });
        }
    }, [navigate]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Función para manejar la navegación al siguiente paso
    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validación del paso 1
            setIsFirstNameEmpty(firstName.trim() === "");
            setIsLastNameEmpty(lastName.trim() === "");
            setIsBirthDateEmpty(birthDate === "");

            if (firstName.trim() === "" || lastName.trim() === "" || birthDate === "") {
                toast.error("Por favor complete todos los campos requeridos");
                return;
            }

            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validación del paso 2
            setIsPhoneEmpty(phoneNumber.trim() === "");
            setIsEmailEmpty(email.trim() === "");
            setIsPasswordEmpty(password.trim() === "");
            setIsConfirmPasswordEmpty(confirmPassword.trim() === "");

            const isEmail = validateEmail(email);
            setIsEmailValid(isEmail);
            setIsPasswordMatch(password === confirmPassword);

            if (phoneNumber.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
                toast.error("Por favor complete todos los campos requeridos");
                return;
            }

            if (!isEmail) {
                toast.error("Formato de correo electrónico inválido");
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Las contraseñas no coinciden");
                return;
            }

            setCurrentStep(3);
        }
    };

    // Función para volver al paso anterior
    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // En el paso 3, no es obligatorio tener avatar, así que continuamos con el registro
        let avatarUrl = "";

        if (avatar) {
            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append("image", avatar);

                const response = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al subir la imagen");
                }

                const data = await response.json();
                avatarUrl = data.imageUrl;
            } catch (err) {
                console.error("Error al subir imagen:", err);
                toast.error("Error al subir imagen. El registro continuará sin imagen.");
            } finally {
                setIsUploading(false);
            }
        }

        try {
            const data = await AuthService.registerAdmin(
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                birthDate,
                avatarUrl
            );

            Swal.fire({
                icon: 'success',
                title: 'Administrador registrado',
                text: data.message || 'El nuevo administrador ha sido registrado exitosamente.',
            });
            navigate("/admin-dashboard");
        } catch (err) {
            console.error(err);

            // Verificar problemas específicos
            if (err.message?.includes("no tiene permisos") || err.message?.includes("sin autorización")) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sin autorización',
                    text: 'No tienes permisos para registrar administradores. Debes ser un administrador para realizar esta acción.',
                    confirmButtonText: 'Volver al inicio',
                    confirmButtonColor: '#d63031'
                }).then(() => {
                    navigate('/');
                });
            } else if (err.message?.includes("phoneNumber") || err.message?.includes("número") ||
                err.response?.data?.error?.includes("phoneNumber") ||
                err.toString().includes("llave duplicada")) {

                Swal.fire({
                    icon: 'error',
                    title: 'Número de teléfono duplicado',
                    text: 'Este número de teléfono ya está registrado. Por favor utiliza otro número.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#d63031'
                });

                // Volver al paso 2 (datos de contacto)
                setCurrentStep(2);

            } else if (err.message?.includes("email") || err.message?.includes("correo")) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email duplicado',
                    text: 'Este correo electrónico ya está registrado. Por favor utiliza otro email.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#d63031'
                });

                // Volver al paso 2 (datos de contacto)
                setCurrentStep(2);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error',
                    text: err.message || 'Por favor inténtalo de nuevo',
                    confirmButtonText: 'Intentar de nuevo',
                    confirmButtonColor: '#d63031'
                });
            }
        }
    };

    // Renderizado basado en el paso actual
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 className="form-title">Paso 1: Datos Personales</h2>
                        <div className="form-group">
                            <label htmlFor="firstName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setIsFirstNameEmpty(false);
                                }}
                                placeholder="Nombre"
                                className={isFirstNameEmpty ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName"><i className="zmdi zmdi-account"></i></label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setIsLastNameEmpty(false);
                                }}
                                placeholder="Apellido"
                                className={isLastNameEmpty ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate"><i className="zmdi zmdi-calendar"></i></label>
                            <input
                                type="date"
                                id="birthDate"
                                value={birthDate}
                                onChange={(e) => {
                                    setBirthDate(e.target.value);
                                    setIsBirthDateEmpty(false);
                                }}
                                placeholder="Fecha de nacimiento"
                                className={isBirthDateEmpty ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group form-button">
                            <button
                                type="button"
                                className="form-submit"
                                onClick={handleNextStep}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="form-title">Paso 2: Datos de Contacto</h2>
                        <div className="form-group">
                            <label htmlFor="phoneNumber"><i className="zmdi zmdi-phone"></i></label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    setIsPhoneEmpty(false);
                                }}
                                placeholder="Número de teléfono"
                                className={isPhoneEmpty ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsEmailEmpty(false);
                                    setIsEmailValid(true);
                                }}
                                placeholder="Email"
                                className={(isEmailEmpty || !isEmailValid) ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><i className="zmdi zmdi-lock"></i></label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setIsPasswordEmpty(false);
                                    if (confirmPassword) {
                                        setIsPasswordMatch(e.target.value === confirmPassword);
                                    }
                                }}
                                placeholder="Contraseña"
                                className={(isPasswordEmpty || !isPasswordMatch) ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword"><i className="zmdi zmdi-lock-outline"></i></label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setIsConfirmPasswordEmpty(false);
                                    setIsPasswordMatch(password === e.target.value);
                                }}
                                placeholder="Confirmar Contraseña"
                                className={(isConfirmPasswordEmpty || !isPasswordMatch) ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group form-button step-2">
                            <button
                                type="button"
                                className="form-button-back"
                                onClick={handlePrevStep}
                            >
                                Atrás
                            </button>
                            <button
                                type="button"
                                className="form-submit"
                                onClick={handleNextStep}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className="form-title">Paso 3: Foto de Perfil</h2>
                        <div className="form-group">
                            <label htmlFor="avatarUrl"><i className="zmdi zmdi-image"></i></label>
                            <input
                                type="file"
                                id="avatarUrl"
                                accept="image/*"
                                onChange={(e) => {
                                    setAvatar(e.target.files[0]);
                                }}
                                className="avatar-input"
                            />
                        </div>
                        {avatar && (
                            <div className="avatar-preview">
                                <img
                                    src={URL.createObjectURL(avatar)}
                                    alt="Vista previa de imagen"
                                    className="preview-image"
                                />
                            </div>
                        )}
                        <div className="form-group form-button step-3">
                            <button
                                type="button"
                                className="form-button-back"
                                onClick={handlePrevStep}
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                className="form-submit"
                                disabled={isUploading}
                            >
                                {isUploading ? "Subiendo imagen..." : "Completar Registro"}
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="register-header">
                        <h2 className="form-title">Registrar Administrador</h2>
                        <div className="register-steps">
                            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                                1
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                                2
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
                                3
                            </div>
                        </div>
                    </div>
                    <div className="signup-content">
                        <div className="signup-form">
                            <form
                                className="register-form"
                                id="register-form"
                                onSubmit={handleSubmit}
                            >
                                {renderStepContent()}
                            </form>
                        </div>
                        <div className="signup-image">
                            <figure><img src="/logo.png" alt="Logo dirección de juventud de la alcaldía" /></figure>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default AdminRegister;