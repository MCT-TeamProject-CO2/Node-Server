export default {
    ms_oauth: {
        tenant: 'common', // see => https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints
        clientId: '',
        clientSecret: '',
        scopes: [ 'openid' ]
    },

    influx_db: {
        url: '',
        token: '',
        organisation: '',
        bucket: ''
    },
    mongo_db: {
        auth: {
            host: "",
            user: "",
            password: "",
            database: "",
            port: 27017
        },
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    }
};