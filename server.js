import express from "express";
import axios from "axios";

const app = express();

// Tu frontend (para permitir el callback desde Ualá)
const FRONTEND_URL = "http://localhost:5173"; // o el puerto que uses

// 1️⃣ Ruta de prueba (redirige al login de Ualá)
app.get("/auth/uala", (req, res) => {
  const callbackUrl = "https://utilities-zh2q.onrender.com/callback"; // debe coincidir con el backend
  const state = "mi_estado_secreto_123"; // podrías generarlo dinámicamente

  const redirectUrl = `https://web.prod.adquirencia.ar.ua.la/?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}&state=${encodeURIComponent(state)}`;

  res.redirect(redirectUrl);
});

// 2️⃣ Callback (Ualá redirige acá)
app.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) return res.send("Falta el parámetro 'code'");

  console.log("🔐 Code recibido:", code);
  console.log("🧩 State recibido:", state);

  try {
    // Consumimos el endpoint de autorización
    const response = await axios.get(
      `https://checkout-bff.prod.adquirencia.ar.ua.la/1/apps/authorize?code=${code}&state=${state}`
    );

    console.log("✅ Credenciales obtenidas:");
    console.log(response.data);

    // Simplemente redirigimos al front
    res.redirect(`${FRONTEND_URL}/success`);
  } catch (err) {
    console.error("❌ Error al obtener credenciales:", err.message);
    res.status(500).send("Error en la autorización");
  }
});

app.listen(3000, () => console.log("✅ Backend en http://localhost:3000"));
