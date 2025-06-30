import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Mail, Lock, Sparkles } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { auth, provider, signInWithPopup } from "../firebase/firebase";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      Swal.fire({
        icon: "warning",
        title: "Verificación requerida",
        text: "Por favor completa el reCAPTCHA antes de continuar.",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/alumno/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass, captcha: captchaToken }), // ⬅️ envía el captcha
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.user);
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de inicio de sesión",
          text: "Credenciales incorrectas",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        navigate("/error500");
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaToken(value);
  };

  const handleGoogleLogin = async () => {
    if (!captchaToken) {
      Swal.fire({
        icon: "warning",
        title: "Verificación requerida",
        text: "Por favor completa el reCAPTCHA antes de continuar.",
        confirmButtonText: "Ok",
      });
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(
        "http://localhost:5000/alumno/login-google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.user);
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de inicio de sesión con Google",
          text: "No se pudo iniciar sesión con Google. Por favor, intenta nuevamente.",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión con Google",
        text: "Ocurrió un error al iniciar sesión con Google.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow p-4 rounded-xl" style={{ border: "none" }}>
            <Card.Body>
              <div className="d-flex justify-content-center mb-4">
                <Sparkles size={48} className="text-primary" />
              </div>

              <h2
                className="text-center mb-4 font-weight-bold"
                style={{ fontSize: "2.25rem", color: "#212529" }}
              >
                Inicia sesión en tu cuenta
              </h2>

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="text-sm text-muted">
                    Usuario o correo electrónico
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={20} />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="text-sm text-muted d-flex justify-content-between w-100">
                    Contraseña
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={20} />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="•••••"
                      required
                      value={pass}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <div className="input-group justify-content-center">
                    <ReCAPTCHA
                      sitekey="6LdG528rAAAAAGixvl-RgHbKk1XgvcgiC3NErHUF"
                      onChange={onChange}
                    />
                  </div>
                </Form.Group>

                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 rounded-pill py-2"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </Button>

                  <div className="text-center my-1 text-muted">o</div>

                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="w-100 rounded-pill py-2 d-flex align-items-center justify-content-center"
                    onClick={handleGoogleLogin}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="24px"
                      height="24px"
                      className="me-2"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,8.065,3.012l5.656-5.656C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,8.065,3.012l5.656-5.656C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-4.611c-2.043,1.385-4.596,2.2-7.219,2.2c-5.202,0-9.626-3.344-11.244-7.943l-6.571,4.819C9.656,39.663,16.318,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,4.611c-0.439,0.316-0.894,0.604-1.358,0.875C35.06,39.663,41.722,44,24,44C12.955,44,4,35.045,4,24c0-1.091,0.111-2.17,0.306-3.229l6.571-4.819C11.63,18.922,12,21.393,12,24c0,4.611,3.328,8.441,7.66,9.59c1.936,0.573,3.956,0.89,6.02,0.89c2.723,0,5.276-0.789,7.329-2.188L43.611,20.083z"
                      />
                    </svg>
                    Iniciar Sesión con Google
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
