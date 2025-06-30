import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Edit,
  Search,
  MessageSquare,
  Trash2,
} from "lucide-react"; // Iconos modernos

function ContenidoA() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className="p-5 shadow rounded-4 border-0"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-dark">
            Acciones Disponibles
          </h2>
          <Row className="g-3">
            <Col xs={12}>
              <Link
                to="agregar"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm"
              >
                <UserPlus size={20} /> Agregar
              </Link>
            </Col>
            <Col xs={12}>
              <Link
                to="modificar"
                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm"
              >
                <Edit size={20} /> Modificar
              </Link>
            </Col>
            <Col xs={12}>
              <Link
                to="consultar"
                className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm text-white"
              >
                <Search size={20} /> Consultar
              </Link>
            </Col>
            <Col xs={12}>
              <Link
                to="mensajes"
                className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm text-white"
              >
                <MessageSquare size={20} /> Mensajes
              </Link>
            </Col>
            <Col xs={12}>
              <Link
                to="eliminar"
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm text-white"
              >
                <Trash2 size={20} /> Eliminar
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ContenidoA;
