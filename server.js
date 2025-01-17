const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware para manejar JSON
app.use(cookieParser()); // Middleware para manejar cookies

// Middleware para validar tokens
const validateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.redirect('/login'); // Redirige si no hay token
  }

  try {
      jwt.verify(token, process.env.JWT_SECRET);
      next(); // Continúa si el token es válido
  } catch (error) {
      console.error('Error al validar el token:', error.message);
      res.redirect('/login'); // Redirige si el token es inválido
  }
};



// Deshabilitar caché para todas las rutas
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Configuración de recursos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/noticias', validateToken, express.static(path.join(__dirname, 'pages/noticias')));
app.use('/inicio', validateToken, express.static(path.join(__dirname, 'pages/miembros')));
app.use('/membresias', validateToken, express.static(path.join(__dirname, 'pages/memberships')));
app.use('/membresias/js', express.static(path.join(__dirname, 'pages/memberships/js')));
app.use('/membresias/assets', express.static(path.join(__dirname, 'pages/memberships/assets')));
app.use('/configuracion', validateToken, express.static(path.join(__dirname, 'pages/configuracion')));
app.use('/rutinas', validateToken, express.static(path.join(__dirname, 'pages/rutinas')));
app.use('/plantilla1', validateToken, express.static(path.join(__dirname, 'pages/plantilla1')));
app.use('/plantilla2', validateToken, express.static(path.join(__dirname, 'pages/plantilla2')));

// Aplicar `validateToken` para proteger recursos estáticos específicos
app.use('/noticias', validateToken, express.static(path.join(__dirname, 'pages/noticias')));
app.use('/inicio', validateToken, express.static(path.join(__dirname, 'pages/miembros')));
app.use('/membresias', validateToken, express.static(path.join(__dirname, 'pages/memberships')));

// Rutas públicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'login', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login/login.html'));
});

// Rutas protegidas dinámicas
app.get('/inicio', validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/miembros.html'));
});

app.get('/noticias', validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/noticias/noticias_riverfit.html'));
});

app.get('/membresias', validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/memberships/membresia_usuario.html'));
});

app.get('/cuenta', validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/configuracion/configuracion.html'));
});

app.get('/rutinas', validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/rutinas/rutinas.html'));
});

// Ruta dinámica para rutinas con plantillas
// Ruta dinámica para las plantillas
// Ruta dinámica para las plantillas
app.get('/rutinas/plantilla:id', validateToken, (req, res) => {
  const { id } = req.query; // Obtener el ID de la rutina desde los parámetros de la URL
  const plantillaId = req.params.id; // Obtener la plantilla desde la ruta dinámica

  // Generar la ruta del archivo correspondiente
  const plantillaPath = path.join(__dirname, `pages/plantilla${plantillaId}/plantilla${plantillaId}.html`);

  // Servir el archivo
  res.sendFile(plantillaPath, (err) => {
      if (err) {
          console.error('Error al servir la plantilla:', err.message);
          res.status(404).send('Página no encontrada.');
      }
  });
});







// Ruta para cerrar sesión (sin tocar el API)
app.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' }); // Elimina el token
  res.redirect('/'); // Solo redirige al inicio
});

// Inicia el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});








