import BaseModule from './structures/BaseModule.js'
import UserModel from './structures/models/UserModel.js'

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