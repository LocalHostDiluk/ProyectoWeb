# 📚 Sistema de Gestión de Alumnos (Alumnos B)

Este proyecto es una aplicación web completa construida con **React + TypeScript** en el frontend y **Express + Firebase** en el backend. Su propósito es permitir la **gestión integral de alumnos**, incluyendo registro, modificación, consulta, eliminación y envío de mensajes internos.

---

## 🚀 Tecnologías Utilizadas

### 🔧 Backend
- Node.js
- Express
- Firebase Admin SDK (Firestore)
- JWT (Autenticación)
- Google reCAPTCHA v2
- Bcryptjs
- Nodemon

### 🎨 Frontend
- React (TypeScript)
- React Router DOM
- Bootstrap + React-Bootstrap
- Ant Design
- SweetAlert2
- Google Login (Firebase Auth)
- Axios

---

## 📁 Estructura del Proyecto


    alumnosb-project/
    │
    ├── back/ # Backend (Node.js + Firebase)
    │ ├── index.js # Punto de entrada del servidor
    │ ├── package.json # Dependencias y scripts del backend
    │ └── src/
    │ ├── config/ # Configuración de Firebase
    │ ├── controller/ # Controladores (auth, alumnos, mensajes)
    │ ├── model/ # Modelo para guardar alumnos
    │ └── routes/ # Definición de rutas 
    │
    ├── front/ # Frontend (React + TS)
    │ ├── public/ # Archivos estáticos
    │ ├── src/
    │ │ ├── auth/ # Lógica de autenticación y contexto
    │ │ ├── Components/ # Componentes reutilizables (tabs, forms, errores)
    │ │ ├── firebase/ # Configuración de Firebase Auth
    │ │ ├── screens/ # Vistas principales de la app
    │ │ └── App.tsx # Enrutamiento principal
    │ ├── package.json # Dependencias y scripts del frontend
    │ └── tsconfig.json # Configuración de TypeScript


---

## 🔑 Funcionalidades

- ✅ Registro de alumnos
- ✏️ Edición y actualización de información
- 🔍 Consulta individual o masiva
- ❌ Eliminación con confirmación
- 🔐 Login tradicional y con Google
- 🧠 Protección con reCAPTCHA v2
- 📬 Envío y gestión de mensajes internos

---

## 🛠️ Instalación

### Clonar el repositorio

```bash
git clone https://github.com/LocalHostDiluk/ProyectoWeb
cd alumnosb-project

1. Instalar Backend

cd back
npm install

2. Instalar Frontend

cd ../front
npm install

▶️ Cómo iniciar el proyecto
Iniciar Backend (Puerto 5000)

cd back
npm start

El servidor Express se ejecutará en:

http://localhost:5000

    Asegúrate de tener tu archivo proyra-9feb9-firebase-adminsdk-xxxx.json en back/src/ correctamente vinculado.

Iniciar Frontend (Puerto 3000)

cd front
npm start

La aplicación React se abrirá automáticamente en:

http://localhost:3000


📬 Rutas Backend Principales
Alumnos

    GET /alumno – Obtener todos

    GET /alumno/traer/:matricula – Buscar por matrícula

    GET /alumnos/traer/:nombre – Buscar por nombre

    POST /alumno/agregar – Registrar

    POST /alumno/modificar – Modificar

    DELETE /alumno/eliminar – Eliminar

Autenticación

    POST /alumno/login – Login tradicional

    POST /alumno/login-google – Login con Google

    GET /alumno/timetoken – Ver tiempo de vida del token

    PATCH /alumno/updatetoken/:userId – Renovar token

Mensajes

    POST /mensaje/enviar – Enviar mensaje

    POST /mensaje/recibidos – Obtener recibidos

    POST /mensaje/enviados – Obtener enviados

    PATCH /mensaje/leido – Marcar como leído

    PATCH /mensaje/descartar – Ocultar mensaje recibido

🔑 Login con reCAPTCHA y Google

Para que funcione correctamente:

    Google reCAPTCHA v2 debe estar configurado con el sitekey y secret.

    Firebase Auth debe estar habilitado en el proyecto de Firebase.

