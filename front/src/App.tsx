import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AlumnosAgregar,
  AlumnosConsultar,
  AlumnoModificar,
  ContenidoA,
  HomeA,
  AlumnoEliminar,
} from "./screens";
import Login from "./auth/LoginForm";
import AuthRoutes from "./auth/AuthRoutes";
import AlumnoMensajes from "./screens/AlumnoMensajes";
import NotFound from "./Components/error404";
import Error500 from "./Components/error500";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error500" element={<Error500 />} />
          <Route
            path="/"
            element={
              <AuthRoutes>
                <HomeA />
              </AuthRoutes>
            }
          >
            <Route index element={<ContenidoA />} />
            <Route path="agregar" element={<AlumnosAgregar />} />
            <Route path="consultar" element={<AlumnosConsultar />} />
            <Route path="modificar" element={<AlumnoModificar />} />
            <Route path="eliminar" element={<AlumnoEliminar />} />
            <Route path="mensajes" element={<AlumnoMensajes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
