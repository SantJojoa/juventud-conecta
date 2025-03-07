import { useState } from "react";
import "./Login.css";
import FeverNavbar from "../../components/fever_navBar/FeverNavbar";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
    };

    return (
        <div className="login-container">
            <FeverNavbar />
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>

                <button className="google-btn">
                    <i className="fab fa-google"></i> Continue with Google
                </button>
                <button className="apple-btn">
                    <i className="fab fa-apple"></i> Iniciar sesión con Apple
                </button>

                <div className="divider"></div>

                <input
                    type="text"
                    placeholder="Email o teléfono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                <div className="options">
                    <a href="#" className="forgot-password">
                        ¿Has olvidado tu contraseña?
                    </a>
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        Mantener la sesión iniciada
                    </label>
                </div>

                <button type="submit" className="login-btn">Iniciar sesión</button>

                <p className="signup">
                    ¿Aun no tienes una cuenta? <a href="#">Unirse ahora</a>
                </p>
            </form>

            <footer>
                <p>© 2025 <a href="#">Condiciones de uso</a> · <a href="#">Política de privacidad</a> · <a href="#">Política de cookies</a></p>
            </footer>
        </div>
    );
};

export default Login;