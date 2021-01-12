export default {
    development: true,

    webserver: {
        port: 8080,

        allow_headers: [
            'Authorization',
            'Access-Control-Allow-Headers',
            'Origin',
            'Accept',
            'Content-Type',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ],
        allow_methods: [
            'DELETE',
            'GET',
            'HEAD',
            'PATCH',
            'POST',
            'PUT'
        ],
        origins: [
            'http://localhost:8080',
            'https://teamproject.pieceof.art'
        ]
    }
};