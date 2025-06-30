import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  InputGroup,
  Modal,
  Row,
  Table,
  Form,
  Card,
} from "react-bootstrap";
import { Eye, Search } from "lucide-react";

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

function AlumnosConsultar() {
  const [alumnos, setAlumnos] = useState<alumnoEstructura[]>([]);
  const [alumnosBase, setAlumnosBase] = useState<alumnoEstructura[]>([]);
  const [alumno, setAlumno] = useState<alumnoEstructura>(initialState);
  const [show, setShow] = useState(false);
  const [buscar, setBuscar] = useState("");

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
  } = alumno || initialState;

  useEffect(() => {
    traerAlumnos();
  }, []);

  const traerAlumnos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/alumno");
      const data = response.data;
      const lista = Array.isArray(data.result) ? data.result : [];

      setAlumnos(lista);
      setAlumnosBase(lista);
    } catch (err) {
      console.error("Error en la petición:", err);
      setAlumnos([]);
      setAlumnosBase([]);
    }
  };

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const AlumnoConsultar = async (matricula: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/alumno/traer/${matricula}`
      );
      if (response.data.status === 200) {
        setShow(true);
        setAlumno(response.data.result[0]);
      } else {
        console.error("Alumno no encontrado:", response.data.message);
      }
    } catch (error) {
      console.error("Error al consultar por matrícula:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setAlumno(initialState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBuscar(valor);

    const textoBuscar = normalizarTexto(valor);

    const filtrados = alumnosBase.filter((alumno) => {
      const nombreCompleto = `${alumno.nombre} ${alumno.aPaterno} ${alumno.aMaterno} ${alumno.matricula}`;
      const textoAlumno = normalizarTexto(nombreCompleto);

      return textoAlumno.includes(textoBuscar);
    });

    setAlumnos(filtrados);
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-lg rounded-4 border-0">
        <h2 className="text-center mb-4 fw-bold">Consultar Alumnos</h2>

        <Row className="mb-4">
          <Col>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o matrícula"
                value={buscar}
                onChange={handleInputChange}
                className="rounded-start-pill"
              />
            </InputGroup>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table bordered hover className="align-middle rounded-3 shadow-sm">
            <thead className="table-primary text-center">
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Correo - Teléfono</th>
                <th>Contacto</th>
                <th>Teléfono contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.matricula}>
                  <td>{alumno.matricula}</td>
                  <td>
                    {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                  </td>
                  <td>
                    {alumno.aCorreo} - {alumno.aTelefono}
                  </td>
                  <td>{alumno.nombreContacto}</td>
                  <td>{alumno.telefonoContacto}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-3 d-flex align-items-center gap-2 mx-auto"
                      onClick={() => AlumnoConsultar(alumno.matricula)}
                    >
                      <Eye size={16} />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {matricula} | {nombre} {aPaterno} {aMaterno}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="mb-2">
              <Col>
                <strong>Teléfono:</strong> {aTelefono}
              </Col>
              <Col>
                <strong>Correo:</strong> {aCorreo}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <strong>Dirección:</strong> {dCalle} {dNumero}, {dColonia},{" "}
                {dCodigoPostal}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <strong>Facebook:</strong> {aFacebook}
              </Col>
              <Col>
                <strong>Instagram:</strong> {aInstagram}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <strong>Tipo de Sangre:</strong> {aTipoSangre}
              </Col>
              <Col>
                <strong>Sexo:</strong>{" "}
                {parseInt(sexo) === 1 ? "Femenino" : "Masculino"}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <strong>Nombre contacto:</strong> {nombreContacto}
              </Col>
              <Col>
                <strong>Teléfono contacto:</strong> {telefonoContacto}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="rounded-pill"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AlumnosConsultar;
