import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import { AuthService } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (formSubmitted) {
            setIsEmailValid(validateEmail(newEmail));
            setIsEmailEmpty(newEmail.trim() === "");
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (formSubmitted) {
            setIsPasswordEmpty(newPassword.trim() === "");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        setIsEmailEmpty(trimmedEmail === "");
        setIsPasswordEmpty(trimmedPassword === "");
        setIsEmailValid(validateEmail(trimmedEmail));

        if (trimmedEmail === "" && trimmedPassword === "") {
            toast.error('Por favor ingresa tu correo electrónico y tu contraseña')
            return;
        }

        if (trimmedEmail === "") {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        if (trimmedPassword === "") {
            toast.error('Por favor ingresa tu contraseña');
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            toast.error("Por favor, ingresa un correo electrónico válido");
            return;
        }

        try {
            const data = await AuthService.login(email, password);
            if (data.role === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'Credenciales incorrectas. Por favor verifica tu email y contraseña',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#d63031'
            });
        }
    };

    return (
        <div className="main">
            <ToastContainer />
            <section className="sign-in">
                <div className="container">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure><img src="/public/logo.png" alt="Logo dirección de juventud de la alcaldía" /></figure>
                            <Link to="/register" className="signup-image-link">¿No tienes una cuenta?</Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Iniciar Sesión</h2>
                            <form className="register-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Email"
                                        className={(formSubmitted && !isEmailValid) || (formSubmitted && isEmailEmpty) ? "invalid-input" : ""} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="your_pass" ><i className="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Contraseña"
                                        className={formSubmitted && isPasswordEmpty ? "invalid-input" : ""}
                                    />
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" className="form-submit" value={"Iniciar Sesión"} />
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

            </section>
        </div>


    );
};

export default Login;