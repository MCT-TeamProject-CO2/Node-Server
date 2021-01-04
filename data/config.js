export default {
    development: true,

    webserver: {
        port: 8080,

        allow_headers: [

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
            'https://example.com'
        ]
    }
};