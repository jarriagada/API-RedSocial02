// Importar módulos
const jwt = require('jwt-simple');
const moment = require('moment');

// Importar clave secreta
const libjwt = require('../services/jwt');
const secret = libjwt.secret; // Corregir nombre de variable

// Función de autenticación
// Comprobar si llegó la cabecera de autenticación
const auth = (req, res, next) => {
  // Leer el token del header.authorization
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'No se proporcionó el token' });
  }

  // Limpiar el token
  const token = req.headers.authorization.replace(/['"]+/g, '');

  // Decodificar el token
  try {
    const payload = jwt.decode(token, secret);

    // Verificar si el token ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(401).json({ message: 'El token ha expirado' });
    }

    // Agregar datos de usuario a request
    req.user = payload;
    // Pasar a ejecución de acción
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;