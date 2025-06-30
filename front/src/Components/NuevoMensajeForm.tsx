import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Select from "react-select";

interface Props {
  remitenteId: string;
}

interface AlumnoOption {
  value: string; // id
  label: string; // nombre completo
}

const NuevoMensajeForm = ({ remitenteId }: Props) => {
  const [alumnos, setAlumnos] = useState<AlumnoOption[]>([]);
  const [destinatarioId, setDestinatarioId] = useState<string>("");
  const [asunto, setAsunto] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await fetch("http://localhost:5000/alumno");
        const data = await res.json();
        if (res.ok) {
          const opciones = data.result
            .filter((alumno: any) => alumno.id !== remitenteId) // excluir al actual
            .map((alumno: any) => ({
              value: alumno.id,
              label: `${alumno.matricula ?? ""} | ${alumno.nombre} ${alumno.aPaterno ?? ""} ${
                alumno.aMaterno ?? ""
              }`.trim(),
            }));
          setAlumnos(opciones);
        }
      } catch (error) {
        console.error("Error cargando alumnos:", error);
      }
    };

    fetchAlumnos();
  }, []);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { remitenteId, destinatarioId, asunto, contenido };

    try {
      const res = await fetch("http://localhost:5000/mensaje/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Enviado", "Mensaje enviado correctamente", "success");
        setDestinatarioId("");
        setAsunto("");
        setContenido("");
      } else {
        Swal.fire("Error", data.message || "Error al enviar", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar al servidor", "error");
    }
  };

  return (
    <Form onSubmit={enviarMensaje}>
      <Form.Group className="mb-3">
        <Form.Label>Destinatario</Form.Label>
        <Select
          options={alumnos}
          value={alumnos.find((a) => a.value === destinatarioId) || null}
          onChange={(opcion) => setDestinatarioId(opcion?.value || "")}
          placeholder="Selecciona un alumno"
          isClearable
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Asunto</Form.Label>
        <Form.Control
          type="text"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contenido</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit">Enviar</Button>
    </Form>
  );
};

export default NuevoMensajeForm;
