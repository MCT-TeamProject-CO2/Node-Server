export default {
    ms_oauth: {
        tenant: 'common', // see => https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints
        clientId: '3c28d7d6-3170-4091-b7b8-aef19b17af47',
        clientSecret: '',
        scopes: [ 'openid', 'email' ]
    },

    influx_db: {
        url: 'http://host.example.com:8086/',
        token: '',
        organisation: 'MCT',
        bucket: 'CO2'
    },
    mongo_db: {
        auth: {
            host: "",
            user: "",
            password: "",
            database: "",
            port: 27018
        },
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    },
    tp_link: {
        email: "",
        password: ""
    },
    mail: {
        email: "",
        auth : {
            user : "",
            pass : ""
        },
        pool : true,
        host : "smtp.scarlet.be",
        port : 465,
        secure : true
    },
};