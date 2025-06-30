import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import alumnosRoutes from "./src/routes/routes.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/", alumnosRoutes);

app.all("/*splat", (req, res) => {
  res.status(404).send("La ruta no existe");
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
