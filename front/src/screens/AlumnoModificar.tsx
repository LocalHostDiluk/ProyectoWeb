import axios from "axios";
import React, { useState } from "react";
import {
  Row,
  Col,
  FloatingLabel,
  Button,
  Container,
  InputGroup,
  Form,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import {
  Search,
  Save,
  XCircle,
  Phone,
  Mail,
  MapPin,
  User2,
  UserCheck,
  Contact2,
} from "lucide-react";

type alumnoEstructura = {
  matricula: string;
  aPaterno: string;
  aMaterno: string;
  nombre: string;
  sexo: string;
  dCalle: string;
  dNumero: number;
  dColonia: string;
  dCodigoPostal: number;
  aTelefono: string;
  aCorreo: string;
  aFacebook: string;
  aInstagram: string;
  aTipoSangre: string;
  nombreContacto: string;
  telefonoContacto: string;
  contraseña: string;
};

type botonesEstado = {
  btnGuardar: boolean;
  btnCancelar: boolean;
};

const initialStateBtn: botonesEstado = {
  btnGuardar: true,
  btnCancelar: true,
};

const initialState: alumnoEstructura = {
  matricula: "",
  aPaterno: "",
  aMaterno: "",
  nombre: "",
  sexo: "",
  dCalle: "",
  dNumero: 0,
  dColonia: "",
  dCodigoPostal: 0,
  aTelefono: "",
  aCorreo: "",
  aFacebook: "",
  aInstagram: "",
  aTipoSangre: "",
  nombreContacto: "",
  telefonoContacto: "",
  contraseña: "",
};

function AlumnoModificar() {
  const [alumno, setAlumno] = useState(initialState);
  const [botones, setBotones] = useState(initialStateBtn);
  const [mat, setMat] = useState("");

  const {
    matricula,
    aPaterno,
    aMaterno,
    nombre,
    sexo,
    dCalle,
    dNumero,
    dColonia,
    dCodigoPostal,
    aTelefono,
    aCorreo,
    aFacebook,
    aInstagram,
    aTipoSangre,
    nombreContacto,
    telefonoContacto,
    contraseña,
  } = alumno;

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const handleMatChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { value } = e.target;
    setMat(value);
  };

  const handleCancelar = (): void => {
    setAlumno(initialState);
    setBotones(initialStateBtn);
    setMat("");
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    let { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const alumnoConsultar = async () => {
    // Validar entrada vacía
    if (!mat.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "Por favor ingresa una matrícula antes de buscar.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/alumno/traer/${mat}`
      );

      // Validar respuesta del servidor
      if (response.data.status === 200 && response.data.result.length > 0) {
        setAlumno(response.data.result[0]);
        setBotones({
          btnGuardar: false,
          btnCancelar: false,
        });
      } else {
        notify(101); // alumno no encontrado
        setAlumno(initialState);
      }
    } catch (error: any) {
      console.error("Error en la consulta:", error);

      // Manejo de errores específico por status
      if (error.response?.status === 404) {
        notify(404);
      } else {
        Swal.fire({
          title: "Error del servidor",
          text: "Ocurrió un problema al intentar buscar el alumno.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const notify = (status: number) => {
    if (status === 200) {
      Swal.fire({
        title: "Completado!",
        text: "Guardado con éxito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      handleCancelar();
      navigate("/");
    }

    if (status === 100) {
      Swal.fire({
        title: "Error!",
        text: "No se pudo guardar el alumno",
        icon: "error",
        confirmButtonText: "Inténtalo de nuevo",
      });
    }

    if (status === 101 || status === 404) {
      Swal.fire({
        title: "No encontrado!",
        text: "No se encontró el alumno con esa matrícula",
        icon: "warning",
        confirmButtonText: "Inténtalo de nuevo",
      });
    }
  };
  const modificarAlumno = async (data: alumnoEstructura) => {
    const response = await axios
      .post("http://localhost:5000/alumno/modificar", data)
      .then((response) => {
        notify(response.data.status);
        setAlumno(initialState);
        setBotones(initialStateBtn);
        setMat("");
      });

    setTimeout(() => navigate("/"), 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    modificarAlumno(alumno);
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold">
        <UserCheck className="me-2 mb-1" size={26} />
        Modificar Alumno
      </h2>

      <Card
        className="shadow-lg p-4 border-0 mb-4"
        style={{ borderRadius: "20px", background: "#f8f9fa" }}
      >
        <Card.Body>
          <Row className="mb-3">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  name="matricula"
                  type="text"
                  placeholder="Ingresa la matrícula a buscar"
                  value={mat}
                  onChange={handleMatChange}
                />
                <Button variant="dark" onClick={alumnoConsultar}>
                  Buscar
                </Button>
              </InputGroup>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit}>
            {/* Información del Alumno */}
            <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
              <Card.Title className="mb-3 fs-5 d-flex align-items-center">
                <User2 className="me-2 text-primary" />
                Información General
              </Card.Title>
              <Row className="g-3">
                <Col md={4}>
                  <FloatingLabel label="Matrícula">
                    <Form.Control
                      name="matricula"
                      type="text"
                      disabled
                      value={matricula}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Nombre">
                    <Form.Control
                      name="nombre"
                      type="text"
                      value={nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Apellido Paterno">
                    <Form.Control
                      name="aPaterno"
                      type="text"
                      value={aPaterno}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Apellido Materno">
                    <Form.Control
                      name="aMaterno"
                      type="text"
                      value={aMaterno}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Sexo">
                    <Form.Select
                      name="sexo"
                      value={sexo}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="1">Femenino</option>
                      <option value="2">Masculino</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
            </Card>

            {/* Contacto y Redes */}
            <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
              <Card.Title className="mb-3 fs-5 d-flex align-items-center">
                <Phone className="me-2 text-success" />
                Contacto y Redes
              </Card.Title>
              <Row className="g-3">
                <Col md={4}>
                  <FloatingLabel label="Teléfono">
                    <Form.Control
                      name="aTelefono"
                      type="text"
                      pattern="^\([0-9]{3}\)[0-9]{7}$"
                      value={aTelefono}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Correo">
                    <Form.Control
                      name="aCorreo"
                      type="email"
                      value={aCorreo}
                      onChange={handleInputChange}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Facebook">
                    <Form.Control
                      name="aFacebook"
                      type="text"
                      value={aFacebook}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Instagram">
                    <Form.Control
                      name="aInstagram"
                      type="text"
                      value={aInstagram}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Tipo de Sangre">
                    <Form.Control
                      name="aTipoSangre"
                      type="text"
                      value={aTipoSangre}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Card>

            {/* Dirección */}
            <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
              <Card.Title className="mb-3 fs-5 d-flex align-items-center">
                <MapPin className="me-2 text-warning" />
                Dirección
              </Card.Title>
              <Row className="g-3">
                <Col md={5}>
                  <FloatingLabel label="Calle">
                    <Form.Control
                      name="dCalle"
                      type="text"
                      value={dCalle}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={2}>
                  <FloatingLabel label="Número">
                    <Form.Control
                      name="dNumero"
                      type="number"
                      value={dNumero}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel label="Colonia">
                    <Form.Control
                      name="dColonia"
                      type="text"
                      value={dColonia}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={2}>
                  <FloatingLabel label="C.P.">
                    <Form.Control
                      name="dCodigoPostal"
                      type="number"
                      value={dCodigoPostal}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Card>

            {/* Contacto de emergencia */}
            <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
              <Card.Title className="mb-3 fs-5 text-danger d-flex align-items-center">
                <Contact2 className="me-2" />
                Contacto de Emergencia
              </Card.Title>
              <Row className="g-3">
                <Col md={6}>
                  <FloatingLabel label="Nombre">
                    <Form.Control
                      name="nombreContacto"
                      type="text"
                      value={nombreContacto}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel label="Teléfono (618)1234567">
                    <Form.Control
                      name="telefonoContacto"
                      type="text"
                      pattern="^\([0-9]{3}\)[0-9]{7}$"
                      value={telefonoContacto}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Card>

            <div className="d-flex justify-content-center gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={botones.btnGuardar}
                className="px-4"
              >
                Guardar
              </Button>
              <Button
                variant="outline-secondary"
                disabled={botones.btnCancelar}
                onClick={handleCancelar}
                className="px-4"
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AlumnoModificar;
