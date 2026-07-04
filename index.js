require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5100;

const connectDB = require('./src/config/database');
const usuarioRoutes = require('./src/routes/usuario');
const authRoutes = require("./src/routes/auth");

connectDB();

app.use(express.json());
app.use('/api',usuarioRoutes, authRoutes);
app.listen(PORT, () =>{
    console.log(`Hello world: http://localhost:${PORT}`);
});