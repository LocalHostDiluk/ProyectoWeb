import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="display-3">404</h1>
      <p className="lead">La página que buscas no existe.</p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </Container>
  );
}

export default NotFound;
