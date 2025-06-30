import { Mensaje } from "./types";

interface Props {
  mensajes: Mensaje[];
  loading: boolean;
  formatFecha: (fecha: { _seconds: number }) => string;
}

const EnviadosTab = ({ mensajes, loading, formatFecha }: Props) => {
  if (loading) return <div>Cargando...</div>;
  if (mensajes.length === 0) return <p>No has enviado mensajes aún.</p>;

  return (
    <ul className="list-group">
      {mensajes.map((msg) => (
        <li key={msg.id} className="list-group-item">
          <strong>Para:</strong> {msg.destinatarioNombre}<br />
          <strong>Asunto:</strong> {msg.asunto || "(Sin asunto)"} <br />
          <strong>Contenido:</strong> {msg.contenido} <br />
          <small className="text-muted">Fecha de envío: {formatFecha(msg.fecha)}</small>
        </li>
      ))}
    </ul>
  );
};

export default EnviadosTab;
