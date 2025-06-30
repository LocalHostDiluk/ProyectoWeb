import axios from "axios";
import React, { useState } from "react";
import {
  Form,
  Button,
  Col,
  Container,
  FloatingLabel,
  Row,
  Card,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Trash2, XCircle } from "lucide-react";

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

function AlumnoEliminar() {
  const [alumno, setAlumno] = useState(initialState);
  const [mat, setMat] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleMatChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { value } = e.target;
    setMat(value);
  };

  const alumnoConsultar = async () => {
    setLoading(true);
    const mat1 = mat === "" ? 0 : mat;

    try {
      const response = await axios.get(
        `http://localhost:5000/alumno/traer/${mat1}`
      );

      if (response.data.status === 200 && response.data.result.length > 0) {
        setAlumno(response.data.result[0]);
        setShow(true);
      } else {
        notify(101);
        setAlumno(initialState);
        setShow(false);
      }
    } catch (error: any) {
      console.error("Error en la consulta:", error);

      if (error.response && error.response.status === 404) {
        Swal.fire({
          title: "No encontrado",
          text: "El alumno con esa matrícula no existe.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al consultar el alumno.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }

      setAlumno(initialState);
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setAlumno(initialState);
    setShow(false);
  };

  const handleEliminar = async () => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este alumno después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/alumno/eliminar`,
          { data: { matricula: alumno.matricula } }
        );

        if (response.data.status === 200) {
          notify(response.data.status);
          setAlumno(initialState);
          setShow(false);
          setMat("");
        } else {
          console.error("Error al eliminar el alumno:", response.data.message);
        }

        setTimeout(() => navigate("/"), 1000);
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    }
  };

  const notify = (status: number) => {
    if (status === 200) {
      Swal.fire({
        title: "Completado!",
        text: "Eliminado con éxito",
        icon: "success",
        confirmButtonText: "Cool",
      });
      handleCancelar();
      navigate("/");
    }
    if (status === 100) {
      Swal.fire({
        title: "Error!",
        text: "No se pudo eliminar el alumno",
        icon: "error",
        confirmButtonText: "Inténtalo de nuevo",
      });
    }
    if (status === 101) {
      Swal.fire({
        title: "No pudo!",
        text: "No se encontró el alumno con esa matrícula",
        icon: "error",
        confirmButtonText: "Inténtalo de nuevo",
      });
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Header className="bg-danger text-white text-center fs-4 fw-semibold rounded-top-4">
          Eliminar Alumno
        </Card.Header>

        <Card.Body className="bg-light rounded-bottom-4 px-5 py-4">
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Form
                className="d-flex gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alumnoConsultar();
                }}
              >
                <FloatingLabel
                  label="Ingresa la matrícula"
                  className="flex-grow-1"
                >
                  <Form.Control
                    name="mat"
                    type="text"
                    placeholder="Matrícula"
                    value={mat}
                    onChange={handleMatChange}
                  />
                </FloatingLabel>

                <Button
                  type="submit"
                  variant="dark"
                  className="d-flex align-items-center gap-2 px-4 rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <Search size={18} />
                      Buscar
                    </>
                  )}
                </Button>
              </Form>
            </Col>
          </Row>

          {show && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white border-0 rounded-4 shadow-sm p-4">
                <Card.Title className="text-center text-danger fs-5 fw-semibold mb-3">
                  Alumno Encontrado
                </Card.Title>

                <Card.Text className="text-secondary fs-6">
                  <p>
                    <strong className="text-dark">Nombre:</strong>{" "}
                    {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                  </p>
                  <p>
                    <strong className="text-dark">Matrícula:</strong>{" "}
                    {alumno.matricula}
                  </p>
                  <p>
                    <strong className="text-dark">Correo:</strong>{" "}
                    {alumno.aCorreo}
                  </p>
                  <p>
                    <strong className="text-dark">Teléfono:</strong>{" "}
                    {alumno.aTelefono}
                  </p>
                  <p>
                    <strong className="text-dark">
                      Contacto de emergencia:
                    </strong>{" "}
                    {alumno.nombreContacto} - {alumno.telefonoContacto}
                  </p>
                </Card.Text>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button
                    variant="danger"
                    onClick={handleEliminar}
                    className="d-flex align-items-center gap-2 px-4"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancelar}
                    className="d-flex align-items-center gap-2 px-4"
                  >
                    <XCircle size={18} />
                    Cancelar
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AlumnoEliminar;
