import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";
import NodeCache from "node-cache";
import dayjs from "dayjs";
import { generateToken } from "./generateToken.js";
import admin from "firebase-admin";

const cache = new NodeCache();

export const login = async (req, res) => {
  const { email, pass, captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ message: "Captcha no verificado." });
  }

  // Verificar con Google
  const secret = "6LdG528rAAAAAPAyhPqNRFl3PBlft6F_xzNOJ6k1";
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`;

  const captchaResponse = await fetch(verifyURL, { method: "POST" });
  const captchaData = await captchaResponse.json();

  if (!captchaData.success || captchaData.score < 0.5) {
    return res.status(400).json({ message: "Captcha inválido." });
  }

  if (!email || !pass) {
    return res
      .status(401)
      .json({ message: "email y password son obligatorios" });
  }

  try {
    const snapshot = await db
      .collection("alumnos")
      .where("aCorreo", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const passwordValida = await bcrypt.compare(pass, user.contraseña);

    if (!passwordValida) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const accessToken = generateToken(user.id);
    cache.set(user.id, accessToken, 60 * 30);

    res.json({ accessToken, user });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getTimeToken = (req, res) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res
      .status(400)
      .json({ message: "Falta o formato incorrecto del userId" });
  }

  const ttl = cache.getTtl(userId);

  if (!ttl) {
    return res.status(404).json({ message: "Token no encontrado" });
  }

  const now = Date.now();
  const timeToLife = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format("HH:mm:ss");

  return res.json({ timeToLife, expTime });
};

export const updateToken = (req, res) => {
  const { userId } = req.params;

  const ttl = cache.getTtl(userId);

  if (!ttl) {
    return res.status(404).json({ message: "Token no encontrado" });
  }

  const newTtl = 60 * 15;
  cache.ttl(userId, newTtl);

  return res.json({ message: "Token actualizado" });
};

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "ID Token es obligatorio" });
  }

  try {
    console.log("ID Token recibido:", idToken);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;
    console.log("Correo decodificado:", email);

    // Buscar si ya existe el alumno por correo
    const snapshot = await db
      .collection("alumnos")
      .where("aCorreo", "==", email)
      .limit(1)
      .get();

    let userDoc;

    if (snapshot.empty) {
      // Generar matrícula única tipo A001, B123, etc.
      const allMatriculasSnapshot = await db.collection("alumnos").get();
      const usedMatriculas = new Set();

      allMatriculasSnapshot.forEach((doc) => {
        const mat = doc.data().matricula;
        if (typeof mat === "string") usedMatriculas.add(mat);
      });

      const generarMatricula = () => {
        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const letra = letras.charAt(Math.floor(Math.random() * letras.length));
        const numero = String(Math.floor(Math.random() * 1000)).padStart(
          3,
          "0"
        );
        return `${letra}${numero}`;
      };

      let nuevaMatricula = generarMatricula();
      while (usedMatriculas.has(nuevaMatricula)) {
        nuevaMatricula = generarMatricula();
      }

      const contraseña = bcrypt.hashSync("google", 10);
      const newUser = {
        aCorreo: email,
        nombre: decodedToken.name || "Nombre no disponible",
        matricula: nuevaMatricula,
        foto: decodedToken.picture || "",
        contraseña: contraseña,
        registradoPorGoogle: true,
        creadoEn: new Date(),
      };

      const docRef = await db.collection("alumnos").add(newUser);
      userDoc = { id: docRef.id, ...newUser };
      console.log("Usuario creado automáticamente:", email);
    } else {
      // Usuario ya existe
      const doc = snapshot.docs[0];
      userDoc = { id: doc.id, ...doc.data() };
    }

    const accessToken = generateToken(userDoc.id);
    cache.set(userDoc.id, accessToken, 60 * 30);

    return res.json({ accessToken, user: userDoc });
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
