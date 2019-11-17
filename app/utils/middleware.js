const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
const GATEWAY_HOST = process.env.GATEWAY_HOST || 'localhost';
const GATEWAY_URL = 'http://' + GATEWAY_HOST + ':' + GATEWAY_PORT;
const TOKEN_PATH = '/validate'
const COUNTER_PATH = '/count'

var request = require('request');

// middleware validacion de token
exports.validarToken = function (req, res, next) {
    var options = {
        url: GATEWAY_URL + TOKEN_PATH
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) return next(new ErrorHandler(500, 'Error de conexión al validador de usuarios'));
        var data = JSON.parse(body);
        if (response.statusCode == 200) return next();
        if (response.statusCode == 401) return next(new ErrorHandler(401, data.error));
        return next(new ErrorHandler(500, 'Error no especificado'));
    }
    request(options, callback);
};

exports.contadorRequest = function (req, res, next) {
    return next();
    /**
     * @TODO falta codigo
     */
}

exports.isAdmin = function (req, res, next) {
    var options = {
        url: GATEWAY_URL + TOKEN_PATH
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) return next(new ErrorHandler(500, 'Error de conexión al validador de usuario'));
        var data = JSON.parse(body);
        if (response.statusCode == 200) {
            if (data.admin) return next();
            return next(new ErrorHandler(500, 'Debe ser administrador para realizar esta acción'));
        }
        return next(new ErrorHandler(500, 'Error no especificado'));
    }
    request(options, callback);
}

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}