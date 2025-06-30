import { Router } from "express";
import {
  saveUser,
  getAllAlumnos,
  getAlumnoByMatricula,
  getAlumnosByNombre,
  updateAlumnoByMatricula,
  deleteAlumnoByMatricula,
} from "../controller/controller.js";
import {
  login,
  getTimeToken,
  updateToken,
  loginWithGoogle,
} from "../controller/authcontroller.js";
import {
  descartarMensaje,
  enviarMensaje,
  marcarMensajeComoLeido,
  obtenerMensajesEnviados,
  obtenerMensajesRecibidos,
} from "../controller/mensajeController.js";

const app = Router();

app.get("/", (req, res) => {
  res.send("¡Hola, mundoo!");
});

app.post("/alumno/agregar", saveUser);
app.get("/alumno", getAllAlumnos);
app.get("/alumno/traer/:matricula", getAlumnoByMatricula);
app.get("/alumnos/traer/:nombre", getAlumnosByNombre);
app.post("/alumno/modificar", updateAlumnoByMatricula);
app.delete("/alumno/eliminar", deleteAlumnoByMatricula);

// Rutas de autenticación
app.post("/alumno/login", login);
app.get("/alumno/timetoken", getTimeToken);
app.patch("/alumno/updatetoken/:userId", updateToken);
app.post("/alumno/login-google", loginWithGoogle);

// Rutas de mensajes
app.post("/mensaje/enviar", enviarMensaje);
app.post("/mensaje/recibidos", obtenerMensajesRecibidos);
app.post("/mensaje/enviados", obtenerMensajesEnviados);
app.patch("/mensaje/leido", marcarMensajeComoLeido);
app.patch("/mensaje/descartar/", descartarMensaje);

export default app;
