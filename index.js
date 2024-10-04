// index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Para manejar datos de formularios
const CryptoJS = require('crypto-js');  // Para cifrado Camellia
const crypto = require('crypto');  // Para hash MD5
const EC = require('elliptic').ec;  // Para Schnorr Signature

const app = express();
const PORT = 3000;

// Inicialización para Schnorr Signature con curva elíptica
const ec = new EC('secp256k1');

// Middleware para parsear el cuerpo de las solicitudes (JSON y x-www-form-urlencoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para cifrar Nombre y Fecha de Nacimiento con Camellia
// Ruta para cifrar Nombre y Fecha de Nacimiento con AES (en lugar de Camellia)
app.post('/cifrar-camellia', (req, res) => {
    const { nombre, fechaNacimiento } = req.body;

    // Verificar que los datos no estén vacíos
    if (!nombre || !fechaNacimiento) {
        return res.status(400).json({ error: 'Nombre y Fecha de Nacimiento son requeridos.' });
    }

    try {
        // Clave de cifrado para AES
        const clave = 'clave-secreta1234'; // Define una clave segura
        // Usar AES en lugar de Camellia, ya que AES está soportado en CryptoJS
        const nombreCifrado = CryptoJS.AES.encrypt(nombre, clave).toString();
        const fechaCifrada = CryptoJS.AES.encrypt(fechaNacimiento, clave).toString();

        // Devolver el resultado como JSON
        res.json({ nombreCifrado, fechaCifrada });
    } catch (error) {
        console.error('Error durante el proceso de cifrado:', error);
        res.status(500).json({ error: 'Error durante el proceso de cifrado' });
    }
});

// Ruta para descifrar Nombre y Fecha de Nacimiento
app.post('/descifrar-camellia', (req, res) => {
    const { nombreCifrado, fechaCifrada } = req.body;

    // Verificar que los datos cifrados no estén vacíos
    if (!nombreCifrado || !fechaCifrada) {
        return res.status(400).json({ error: 'Nombre y Fecha Cifrados son requeridos.' });
    }

    try {
        const clave = 'clave-secreta1234'; // Usar la misma clave utilizada para cifrar
        // Descifrar el nombre y la fecha usando AES
        const nombreDescifrado = CryptoJS.AES.decrypt(nombreCifrado, clave).toString(CryptoJS.enc.Utf8);
        const fechaDescifrada = CryptoJS.AES.decrypt(fechaCifrada, clave).toString(CryptoJS.enc.Utf8);

        // Devolver los datos descifrados como JSON
        res.json({ nombreOriginal: nombreDescifrado, fechaOriginal: fechaDescifrada });
    } catch (error) {
        console.error('Error durante el proceso de descifrado:', error);
        res.status(500).json({ error: 'Error durante el proceso de descifrado' });
    }
});


// Ruta para firmar los datos de Tarjeta y DNI con Schnorr
app.post('/firma-schnorr', (req, res) => {
    const { tarjetaCredito, dni } = req.body;

    if (!tarjetaCredito || !dni) {
        return res.status(400).json({ error: 'Tarjeta de Crédito y DNI son requeridos.' });
    }

    try {
        const clavePrivada = ec.genKeyPair();
        const clavePublica = clavePrivada.getPublic('hex');

        const mensaje = tarjetaCredito + dni;

        const firma = clavePrivada.sign(mensaje);
        const firmaCodificada = { r: firma.r.toString('hex'), s: firma.s.toString('hex') };

        res.json({ firma: firmaCodificada, clavePublica });
    } catch (error) {
        console.error('Error durante la firma Schnorr:', error);
        res.status(500).json({ error: 'Error durante el proceso de firma Schnorr' });
    }
});




// Ruta para generar hash MD5 para contraseñas
app.post('/generar-hash-md5', (req, res) => {
    const { contrasena } = req.body;
    const hash = crypto.createHash('md5').update(contrasena).digest('hex');
    res.json({ hash });
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
