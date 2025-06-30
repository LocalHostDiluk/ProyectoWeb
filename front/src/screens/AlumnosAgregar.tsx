import React, { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  FloatingLabel,
  Container,
  Card,
} from "react-bootstrap";
import "sweetalert2/dist/sweetalert2.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User2,
  Lock,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Droplet,
  MapPin,
  Contact2,
  Save,
  XCircle,
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

function AlumnosAgregar() {
  const [alumno, setAlumno] = useState(initialState);
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

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    let { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const handleCancelar = (): void => {
    setAlumno(initialState);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    addAlumno(alumno);
  };

  const addAlumno = async (data: alumnoEstructura) => {
    const response = await axios
      .post("http://localhost:5000/alumno/agregar", data)
      .then((response) => {
        notify(response.data.status);
      });
  };

  const notify = (status: number) => {
    if (status >= 200 && status < 300) {
      Swal.fire({
        title: "Completado!",
        text: "Guardado con éxito",
        icon: "success",
        confirmButtonText: "Cool",
      });
      handleCancelar();
      navigate("/");
    } else {
      Swal.fire({
        title: "Error!",
        text: "No se pudo guardar el alumno",
        icon: "error",
        confirmButtonText: "Inténtalo de nuevo",
      });
    }
  };

  return (
    <Container className="py-4">
      <Form onSubmit={handleSubmit}>
        {/* Datos Personales */}
        <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
          <Card.Title className="mb-3 fs-5 d-flex align-items-center">
            <User2 className="me-2 text-primary" />
            Datos Personales
          </Card.Title>
          <Row className="g-3">
            <Col md={4}>
              <FloatingLabel label="Matrícula">
                <Form.Control
                  name="matricula"
                  type="text"
                  placeholder="Ingresa tu matrícula"
                  value={matricula}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Contraseña">
                <Form.Control
                  name="contraseña"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={contraseña}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>

          <Row className="g-3 mt-2">
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
                  <option value="">Seleccione tu sexo</option>
                  <option value="1">Femenino</option>
                  <option value="2">Masculino</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Teléfono (ej: (618)1234567)">
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
              <FloatingLabel label="Correo electrónico">
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
              <FloatingLabel label="Perfil Facebook">
                <Form.Control
                  name="aFacebook"
                  type="text"
                  value={aFacebook}
                  onChange={handleInputChange}
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Perfil Instagram">
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
                  required
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
                  required
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
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md={2}>
              <FloatingLabel label="Código Postal">
                <Form.Control
                  name="dCodigoPostal"
                  type="number"
                  value={dCodigoPostal}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Card>

        {/* Contacto de Emergencia */}
        <Card className="mb-4 p-4 bg-white border-0 shadow-sm rounded-4">
          <Card.Title className="mb-3 fs-5 d-flex align-items-center text-danger">
            <Contact2 className="me-2" />
            Contacto de Emergencia
          </Card.Title>
          <Row className="g-3">
            <Col md={6}>
              <FloatingLabel label="Nombre del contacto">
                <Form.Control
                  name="nombreContacto"
                  type="text"
                  value={nombreContacto}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Teléfono (ej: (618)1234567)">
                <Form.Control
                  name="telefonoContacto"
                  type="text"
                  pattern="^\([0-9]{3}\)[0-9]{7}$"
                  value={telefonoContacto}
                  onChange={handleInputChange}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Card>

        {/* Botones */}
        <div className="d-flex justify-content-center gap-3">
          <Button type="submit" variant="primary" className="px-4">
            <Save className="me-2" size={18} />
            Guardar
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleCancelar}
            className="px-4"
          >
            <XCircle className="me-2" size={18} />
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AlumnosAgregar;
