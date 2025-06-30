import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import { Mensaje } from "../Components/types";
import NuevoMensajeForm from "../Components/NuevoMensajeForm";
import EnviadosTab from "../Components/EnviadosTab";
import RecibidosTab from "../Components/RecibidosTab";

const AlumnoMensajes = () => {
  const { user } = useAuth();
  const alumnoId = user?.id;

  const [recibidos, setRecibidos] = useState<Mensaje[]>([]);
  const [enviados, setEnviados] = useState<Mensaje[]>([]);
  const [loadingRecibidos, setLoadingRecibidos] = useState(true);
  const [loadingEnviados, setLoadingEnviados] = useState(true);

  useEffect(() => {
    if (!alumnoId) return;

    const cargarRecibidos = async () => {
      const res = await fetch("http://localhost:5000/mensaje/recibidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAlumno: alumnoId }),
      });
      const data = await res.json();
      if (res.ok) {
        const visibles = data.mensajes.filter((m: Mensaje) => m.ver !== false);
        setRecibidos(visibles);
      }
      setLoadingRecibidos(false);
    };

    const cargarEnviados = async () => {
      const res = await fetch("http://localhost:5000/mensaje/enviados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAlumno: alumnoId }),
      });
      const data = await res.json();
      if (res.ok) setEnviados(data.mensajes);
      setLoadingEnviados(false);
    };

    cargarRecibidos();
    cargarEnviados();
  }, [alumnoId]);

  const marcarLeido = async (id: string) => {
    await fetch("http://localhost:5000/mensaje/leido", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRecibidos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
    );
  };

  const eliminarMensaje = async (id: string) => {
    await fetch("http://localhost:5000/mensaje/descartar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRecibidos((prev) => prev.filter((m) => m.id !== id));
  };

  const formatFecha = (fecha: { _seconds: number }) =>
    new Date(fecha._seconds * 1000).toLocaleString();

  return (
    <div className="container py-4">
      <h2 className="mb-4">📨 Centro de Mensajes</h2>
      <Tabs defaultActiveKey="recibidos" className="mb-3">
        <Tab eventKey="recibidos" title="📥 Recibidos">
          <RecibidosTab
            mensajes={recibidos}
            loading={loadingRecibidos}
            onMarcarLeido={marcarLeido}
            onEliminar={eliminarMensaje}
            formatFecha={formatFecha}
          />
        </Tab>
        <Tab eventKey="enviados" title="📤 Enviados">
          <EnviadosTab
            mensajes={enviados}
            loading={loadingEnviados}
            formatFecha={formatFecha}
          />
        </Tab>
        <Tab eventKey="nuevo" title="✉️ Nuevo mensaje">
          {alumnoId && <NuevoMensajeForm remitenteId={alumnoId} />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default AlumnoMensajes;
