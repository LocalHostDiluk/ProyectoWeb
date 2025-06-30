import { Card, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Mensaje } from "./types";

interface Props {
  mensajes: Mensaje[];
  loading: boolean;
  onMarcarLeido: (id: string) => void;
  onEliminar: (id: string) => void;
  formatFecha: (fecha: { _seconds: number }) => string;
}

const RecibidosTab = ({
  mensajes,
  loading,
  onMarcarLeido,
  onEliminar,
  formatFecha,
}: Props) => {
  if (loading) return <Spinner animation="border" />;
  if (mensajes.length === 0) return <p>No tienes mensajes aún.</p>;

  return (
    <div className="d-grid gap-3">
      {mensajes.map((msg) => (
        <Card key={msg.id} className={msg.leido ? "" : "border-primary"}>
          {!msg.leido && (
            <span className="badge bg-primary position-absolute top-0 end-0 m-2">
              Nuevo
            </span>
          )}
          <Card.Body>
            <Card.Title>{msg.asunto || "Sin asunto"}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              De: {msg.remitenteNombre}
            </Card.Subtitle>
            <Card.Text>{msg.contenido}</Card.Text>
            <small className="text-muted">{formatFecha(msg.fecha)}</small>
            <div className="mt-3 d-flex gap-2">
              {!msg.leido && (
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={() => onMarcarLeido(msg.id)}
                >
                  Marcar como leído
                </Button>
              )}
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onEliminar(msg.id)}
              >
                Eliminar
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default RecibidosTab;
