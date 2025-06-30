// src/pages/Error500.tsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Error500() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="display-4 text-danger">500</h1>
      <p className="lead">Ocurrió un error interno del servidor.</p>
      <Button variant="dark" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </Container>
  );
}

export default Error500;
