import EventModule from './structures/EventModule.js'
import mongoose from 'mongoose'

export default class MongoDB extends EventModule {
    constructor(main) {
        super(main);

        this.register(MongoDB, {
            name: 'mongo'
        });
    }

    async init() {
        const config = this.auth.mongo_db;

        try {
            await mongoose.connect(
                `mongodb://${config.auth.user}:${config.auth.password}@${config.auth.host}:${config.auth.port}/${config.auth.database}`,
                config.options);
        } catch (error) {
            this.log.critical('MONGO', 'Could not establish connection to MongoDB server:', error);

            return false;
        }

        if (this.config.development) {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                this.log.verbose('MONGO', `${collectionName}.${method} ${JSON.stringify(query)}`, doc);
            });
        }

        this.log.info('MONGO', 'Established connection to MongoDB successfully.');

        this.emit('ready');

        return true;
    }
}