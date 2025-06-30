import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import MiBreadcrumb from "../Components/breadcrumb";

function HomeA() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar
        expand="lg"
        bg="light"
        variant="light"
        className="shadow-sm py-3 mb-4"
        style={{ borderBottom: "1px solid #dee2e6" }}
      >
        <Container>
          <Navbar.Brand
            href="/"
            className="fw-bold"
            style={{ fontSize: "1.5rem", color: "#212529" }}
          >
            Alumnos B
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="px-3">
                Inicio
              </Nav.Link>
              <NavDropdown
                title="Acciones"
                id="nav-dropdown-actions"
                className="px-3"
              >
                <NavDropdown.Item href="agregar">Agregar</NavDropdown.Item>
                <NavDropdown.Item href="modificar">Modificar</NavDropdown.Item>
                <NavDropdown.Item href="eliminar">Eliminar</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="consultar">Consultar</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="mensajes" className="px-3">
                Mensajes
              </Nav.Link>
            </Nav>

            {/* Nombre del usuario y botón de logout */}
            <Nav className="ms-auto">
              <NavDropdown
                title={`👤 ${user?.nombre ?? "Usuario"}`}
                id="nav-dropdown-user"
                align="end"
              >
                <NavDropdown.Header>
                  {user?.aCorreo ?? "Sin correo"}
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item className="text-danger" onClick={handleLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <MiBreadcrumb />
      </Container>

      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default HomeA;
