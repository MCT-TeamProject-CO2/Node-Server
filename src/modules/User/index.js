import BaseModule from './structures/BaseModule.js'
import UserModel from './structures/models/UserModel.js'
import Constants from './util/Constants.js'
import crypto from 'crypto'

export default class User extends BaseModule {
    /**
     * 
     * @param {Main} main 
     */
    constructor(main) {
        super(main);

        this.register(User, {
            name: 'user',
            requires: [ 'mongo' ]
        });
    }

    async init() {
        const admin = await this.model.getUser({ username: "admin" });
        if (!admin) {
            const randomPass = crypto.randomBytes(32).toString('base64');
            this.log.info("User", `Password for the admin account: ${randomPass}`);
            const newAdmin = {
                "email": "admin@example.com",
                "type": "normal",
                "permission": "root",
                "username": "admin",
                "password": randomPass
            };
            this.model.createUser(newAdmin);
        }
        return true;
    }

    get constants() {
        return Constants;
    }

    get model() {
        return UserModel;
    }

    /**
     * 
     * @param {string} sessionId 
     */
    async getUserFromSession(sessionId) {
        const session = await this.modules.sessions.model.getSession(sessionId);
        if (!session) return null;

        return this.model.getUser({ uid: session.uid });
    }
}