import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../login/Login.css';
import "../login/fonts/material-icon/css/material-design-iconic-font.min.css";
import { AuthService } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        setIsNameEmpty(name.trim() === "");
        setIsEmailEmpty(email.trim() === "");
        setIsPasswordEmpty(password.trim() === "");
        setIsConfirmPasswordEmpty(confirmPassword.trim() === "")

        const isEmail = validateEmail(email);
        setIsEmailValid(isEmail);
        setIsPasswordMatch(password === confirmPassword);

        if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
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


        try {
            const data = await AuthService.register(name, email, password);
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
                text: 'Por favor inténtalo de nuevo',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#d63031'
            });
        }
    };

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">Crear Cuenta</h2>
                            <form className="register-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setIsNameEmpty(false);
                                        }}
                                        placeholder="Nombre"
                                        className={isNameEmpty ? "invalid-input" : ""}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email"><i className="zmdi zmdi-email material-icons-name"></i></label>
                                    <input
                                        type="email"
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
                                    <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
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
                                    <input type="submit" id="submit" className="form-submit" value="Registrarse" />
                                </div>
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
    )

};

export default Register;