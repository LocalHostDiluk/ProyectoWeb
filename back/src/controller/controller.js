import bcrypt from "bcryptjs";
import { saveUserToFirestore } from "../model/userModel.js";
import { db } from "../config/firebase.js";

export const saveUser = async (req, res) => {
  const {
    matricula,
    aPaterno,
    aMaterno,
    nombre,
    sexo,
    dCalle,
    dNumero,
    dColonia,
    dCodigoPostal,
    aTelefono,
    aCorreo,
    aFacebook,
    aInstagram,
    aTipoSangre,
    nombreContacto,
    telefonoContacto,
    contraseña,
    foto,
  } = req.body;

  if (!matricula || !nombre || !contraseña) {
    return res.status(400).send({
      status: 400,
      mensaje: "Campos requeridos: matricula, nombre y contraseña.",
    });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  try {
    const userData = {
      matricula,
      aPaterno,
      aMaterno,
      nombre,
      sexo,
      dCalle,
      dNumero,
      dColonia,
      dCodigoPostal,
      aTelefono,
      aCorreo,
      aFacebook,
      aInstagram,
      aTipoSangre,
      nombreContacto,
      telefonoContacto,
      contraseña: hashedPassword,
      foto: foto || null,
    };

    const result = await saveUserToFirestore(userData);

    res.status(201).send({
      status: 201,
      mensaje: "Alumno agregado exitosamente",
      data: result,
    });
  } catch (err) {
    console.error("Error al agregar el alumno en el controlador:", err);
    res.status(500).send({
      status: 500,
      mensaje: err.message || "Error interno del servidor al agregar alumno.",
    });
  }
};

export const getAllAlumnos = async (req, res) => {
  try {
    const snapshot = await db.collection("alumnos").get();

    const alumnos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send({
      status: 200,
      result: alumnos,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      mensaje: "Error al obtener alumnos",
      error: err.message,
    });
  }
};

export const getAlumnoByMatricula = async (req, res) => {
  const { matricula } = req.params;

  try {
    const snapshot = await db
      .collection("alumnos")
      .where("matricula", "==", matricula)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({
        status: 404,
        mensaje: "Alumno no encontrado",
      });
    }

    const alumnos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send({
      status: 200,
      result: alumnos,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      mensaje: "Error al buscar alumno por matrícula",
      error: err.message,
    });
  }
};

export const getAlumnosByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const alumnosRef = db.collection("alumnos");
    const snapshot = await alumnosRef
      .where("nombre", ">=", nombre)
      .where("nombre", "<=", nombre + "\uf8ff") // búsqueda parcial
      .get();

    if (snapshot.empty) {
      return res.status(200).send({
        status: 200,
        result: [], // <- importante
      });
    }

    const alumnos = snapshot.docs.map((doc) => doc.data());
    res.status(200).send({
      status: 200,
      result: alumnos,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: "Error al buscar alumnos",
      error: err.message,
    });
  }
};

export const updateAlumnoByMatricula = async (req, res) => {
  const {
    matricula,
    aPaterno,
    aMaterno,
    nombre,
    sexo,
    dCalle,
    dNumero,
    dColonia,
    dCodigoPostal,
    aTelefono,
    aCorreo,
    aFacebook,
    aInstagram,
    aTipoSangre,
    nombreContacto,
    telefonoContacto,
    contraseña,
  } = req.body;

  if (!matricula) {
    return res.status(400).send({
      status: 400,
      mensaje: "Se requiere la matrícula para actualizar el alumno.",
    });
  }

  try {
    const snapshot = await db
      .collection("alumnos")
      .where("matricula", "==", matricula)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({
        status: 404,
        mensaje: "Alumno no encontrado",
      });
    }

    const docRef = snapshot.docs[0].ref;

    await docRef.update({
      aPaterno,
      aMaterno,
      nombre,
      sexo,
      dCalle,
      dNumero,
      dColonia,
      dCodigoPostal,
      aTelefono,
      aCorreo,
      aFacebook,
      aInstagram,
      aTipoSangre,
      nombreContacto,
      telefonoContacto,
      contraseña,
    });

    res.status(200).send({
      status: 200,
      mensaje: "Alumno actualizado correctamente.",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      mensaje: "Error al actualizar alumno",
      error: err.message,
    });
  }
};

export const deleteAlumnoByMatricula = async (req, res) => {
  const { matricula } = req.body;

  if (!matricula) {
    return res.status(400).send({
      status: 400,
      mensaje: "Se requiere la matrícula para eliminar el alumno.",
    });
  }

  try {
    const snapshot = await db
      .collection("alumnos")
      .where("matricula", "==", matricula)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({
        status: 404,
        mensaje: "Alumno no encontrado",
      });
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.delete();

    res.status(200).send({
      status: 200,
      mensaje: "Alumno eliminado correctamente.",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      mensaje: "Error al eliminar alumno",
      error: err.message,
    });
  }
};
