import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../login/Login.css';
import "../login/fonts/material-icon/css/material-design-iconic-font.min.css";
import { AuthService } from "../../services/authService";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password != confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            const data = await AuthService.register(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">Crear Cuenta</h2>
                            <form className="register-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Nombre"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email"><i className="zmdi zmdi-email material-icons-name"></i></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Contraseña"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i></label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirmar Contraseña"
                                    />
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" id="submit" className="form-submit" value="Registrarse" />
                                </div>
                            </form>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                        <div className="signup-image">
                            <figure><img src="/logo.png" alt="Logo dirección de juventud de la alcaldía" /></figure>
                            <Link to="/login" className="signup-image-link">¿Ya tienes una cuenta?</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )

};

export default Register;