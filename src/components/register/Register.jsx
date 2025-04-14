import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../login/Login.css';
import "../login/fonts/material-icon/css/material-design-iconic-font.min.css";
import { AuthService } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Register = () => {
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
    const [phone, setPhone] = useState("");
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

    // Estados generales
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            setIsPhoneEmpty(phone.trim() === "");
            setIsEmailEmpty(email.trim() === "");
            setIsPasswordEmpty(password.trim() === "");
            setIsConfirmPasswordEmpty(confirmPassword.trim() === "");

            const isEmail = validateEmail(email);
            setIsEmailValid(isEmail);
            setIsPasswordMatch(password === confirmPassword);

            if (phone.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
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
                formData.append('file', avatar);
                formData.append('upload_preset', 'avatar-unsigned');

                const res = await fetch(`https://api.cloudinary.com/v1_1/dqgpyi8ox/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Failed to upload avatar");
                }
                const data = await res.json();
                avatarUrl = data.secure_url;
                setIsUploading(false);
            } catch (err) {
                console.log(err);
                setIsUploading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir la imagen',
                    text: 'No se pudo subir el avatar a Cloudinary',
                    confirmButtonColor: '#d63031'
                });
                return;
            }
        }

        try {
            // Enviar los datos con la nueva estructura
            const data = await AuthService.register(
                firstName,
                lastName,
                email,
                password,
                phone,
                birthDate,
                avatarUrl
            );

            Swal.fire({
                icon: 'success',
                title: 'Cuenta creada',
                text: 'Bienvenido a la plataforma para la juventud, creada por la juventud.',
            });
            navigate("/");
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error inesperado',
                text: err.message || 'No pudimos procesar tu solicitud',
                confirmButtonColor: '#d63031'
            });
            console.log(err)
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
                                placeholder="Nombres"
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
                                placeholder="Apellidos"
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
                            <label htmlFor="phone"><i className="zmdi zmdi-phone"></i></label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
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
                                placeholder="Correo electrónico"
                                className={(isEmailEmpty || !isEmailValid) ? "invalid-input" : ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                            <input
                                type="password"
                                id="pass"
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
                            <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i></label>
                            <input
                                type="password"
                                id="re-pass"
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
                        <div className="form-group form-button">
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
                        <h2 className="form-title">Paso 3: Foto de Perfil (Opcional)</h2>
                        <div className="form-group upload-group">
                            <input
                                type="file"
                                id="avatarUrl"
                                accept="image/*"
                                onChange={(e) => {
                                    setAvatar(e.target.files[0]);
                                }}
                                className="avatar-input"
                            />

                            <div className="custom-file-upload" onClick={() => document.getElementById('avatarUrl').click()}>
                                <i className="zmdi zmdi-cloud-upload"></i> Seleccionar imagen de perfil

                            </div>

                            {avatar && (
                                <div className="file-name-display">
                                    {avatar.name}
                                </div>
                            )}
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
                        <div className="terms-text">
                            <p>Al hacer clic en "Completar Registro", aceptas nuestras <a href="/terms">Condiciones</a>, <a href="/privacy">Política de privacidad</a> y <a href="/cookies">Política de cookies</a>. Es posible que te enviemos notificaciones por Email, WhatsApp o SMS    , que puedes desactivar cuando quieras.</p>
                        </div>

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
                        <h2 className="form-title">Registro</h2>
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
                            <Link to="/login" className="signup-image-link">¿Ya tienes una cuenta?</Link>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};


export default Register;