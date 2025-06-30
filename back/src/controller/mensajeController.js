import { db } from "../config/firebase.js";

export const enviarMensaje = async (req, res) => {
  const { remitenteId, destinatarioId, asunto, contenido } = req.body;

  if ((!remitenteId || !destinatarioId || !contenido, !asunto)) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    await db.collection("mensajes").add({
      remitenteId,
      destinatarioId,
      asunto: asunto || "",
      contenido,
      leido: false,
      ver: true,
      fecha: new Date(),
    });

    return res.status(200).json({ message: "Mensaje enviado con éxito." });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    return res.status(500).json({ message: "Error enviando el mensaje." });
  }
};

export const obtenerMensajesRecibidos = async (req, res) => {
  const { idAlumno } = req.body;

  if (!idAlumno) {
    return res.status(400).json({ message: "Falta el id del alumno." });
  }

  try {
    // 1. Obtener mensajes recibidos
    const snapshot = await db
      .collection("mensajes")
      .where("destinatarioId", "==", idAlumno)
      .orderBy("fecha", "desc")
      .get();

    const mensajesRaw = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Obtener los remitenteId únicos
    const remitenteIds = [
      ...new Set(mensajesRaw.map((msg) => msg.remitenteId)),
    ];

    // 3. Obtener datos de los remitentes desde 'alumnos'
    const alumnosSnapshot = await db.getAll(
      ...remitenteIds.map((id) => db.collection("alumnos").doc(id))
    );

    const alumnosMap = {};
    alumnosSnapshot.forEach((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data();
        alumnosMap[docSnap.id] = `${data.nombre} ${data.aPaterno ?? ""} ${
          data.aMaterno ?? ""
        }`.trim();
      }
    });

    // 4. Agregar remitenteNombre a cada mensaje
    const mensajes = mensajesRaw.map((msg) => ({
      ...msg,
      remitenteNombre: alumnosMap[msg.remitenteId] || msg.remitenteId,
    }));

    return res.status(200).json({ mensajes });
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    return res.status(500).json({ message: "Error obteniendo mensajes." });
  }
};

export const obtenerMensajesEnviados = async (req, res) => {
  const { idAlumno } = req.body;

  if (!idAlumno) {
    return res.status(400).json({ message: "Falta el id del alumno." });
  }

  try {
    // 1. Obtener los mensajes enviados
    const snapshot = await db
      .collection("mensajes")
      .where("remitenteId", "==", idAlumno)
      .orderBy("fecha", "desc")
      .get();

    const mensajesRaw = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Obtener los destinatarioId únicos
    const destinatarioIds = [
      ...new Set(mensajesRaw.map((msg) => msg.destinatarioId)),
    ];

    // 3. Obtener datos de los destinatarios desde 'alumnos'
    const alumnosSnapshot = await db.getAll(
      ...destinatarioIds.map((id) => db.collection("alumnos").doc(id))
    );

    const alumnosMap = {};
    alumnosSnapshot.forEach((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data();
        alumnosMap[docSnap.id] = `${data.nombre} ${data.aPaterno ?? ""} ${
          data.aMaterno ?? ""
        }`.trim();
      }
    });

    // 4. Agregar destinatarioNombre a cada mensaje
    const mensajes = mensajesRaw.map((msg) => ({
      ...msg,
      destinatarioNombre: alumnosMap[msg.destinatarioId] || msg.destinatarioId,
    }));

    return res.status(200).json({ mensajes });
  } catch (error) {
    console.error("Error obteniendo mensajes enviados:", error);
    return res
      .status(500)
      .json({ message: "Error obteniendo mensajes enviados." });
  }
};

export const marcarMensajeComoLeido = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Falta el id del mensaje." });
  }

  try {
    await db.collection("mensajes").doc(id).update({
      leido: true,
    });

    return res.status(200).json({ message: "Mensaje marcado como leído." });
  } catch (error) {
    console.error("Error marcando mensaje como leído:", error);
    return res
      .status(500)
      .json({ message: "Error marcando mensaje como leído." });
  }
};

export const descartarMensaje = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Falta el id del mensaje." });
  }

  try {
    await db.collection("mensajes").doc(id).update({
      ver: false,
    });

    return res.status(200).json({ message: "Mensaje descartado." });
  } catch (error) {
    console.error("Error marcando mensaje como leído:", error);
    return res
      .status(500)
      .json({ message: "Error marcando mensaje como leído." });
  }
};
