import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import { AuthService } from "../../services/authService";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        try {
            const data = await AuthService.login(email, password);
            if (data.role === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="main">
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
                                    <label for="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <label for="your_pass" ><i className="zmdi zmdi-lock"></i></label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Contraseña" />
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" className="form-submit" value={"Iniciar Sesión"} />
                                </div>
                            </form>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </div>

                    </div>
                </div>

            </section>
        </div>


    );
};

export default Login;