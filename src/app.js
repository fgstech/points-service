// app.js
const express = require('express');
const AuthMiddleware = require("./middlewares/authMiddleware")
const pointsRoutes = require('./routes/pointsRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const objetiveRoutes = require('./routes/objetiveRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('./config/database'); // Conexión a MongoDB

const app = express();
app.use(express.json());
app.use("/api", AuthMiddleware.protect, pointsRoutes);
app.use("/api", AuthMiddleware.protect, webhookRoutes);
app.use("/api", AuthMiddleware.protect, objetiveRoutes);
app.use("/api", AuthMiddleware.adminProtect, adminRoutes);

module.exports = app;