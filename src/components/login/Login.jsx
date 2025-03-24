import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import "./fonts/material-icon/css/material-design-iconic-font.min.css";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en el login");
            }

            // Guardar token y rol
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.name);

            // Redirigir según el rol
            if (data.role === "admin") {
                navigate("/create-event");
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
                            <a href="#" className="signup-image-link">Crear una cuenta</a>
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
