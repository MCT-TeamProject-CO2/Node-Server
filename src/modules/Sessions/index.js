import BaseModule from './structures/BaseModule.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Session from './structures/Session.js'
import SessionModel from './structures/models/SessionModel.js'

export default class Sessions extends BaseModule {
    _sessions = new Map();

    constructor(main) {
        super(main);

        this.register(Sessions, {
            name: 'session',
            requires: [ 'mongo' ]
        });
    }

    get crypto() {
        return crypto;
    }

    get model() {
        return SessionModel;
    }

    get sessions() {
        return this._sessions;
    }

    /**
     * Returns a unique enough session id string
     * @param {UserSchema} user The UUID of the user to assign the session to.
     */
    async createSession(user) {
        let sessionId;

        do {
            sessionId = crypto.randomBytes(16).toString('base64');
        } while (await this.model.doesSessionExist(sessionId));

        await this.model.createSession(user.uid, sessionId);

        const session = new Session(this, sessionId, user);
        // Keep a local copy of our sessions
        this.sessions.set(sessionId, session);

        return sessionId;
    }

    /**
     * @param {string} sessionId
     * @returns {Session}
     */
    async getSession(sessionId) {
        let session = this.sessions.get(sessionId);
        if (session) return session;

        session = await this.model.getSession(sessionId);
        if (session) {
            const user = await this.modules.user.model.getUser({ uid: session.uid });
            session = new Session(this, sessionId, user);

            this.sessions.set(sessionId, session);

            return session;
        }
        return null;
    }

    /**
     * @param {string} sessionId
     * @returns {boolean}
     */
    async isSessionValid(sessionId, permLevel) {
        const session = await this.getSession(sessionId);
        if (session) return session.isValid(permLevel);
        return false;
    }

    /**
     * Removes the session from the local cache and from the database
     * @param {string} sessionId 
     */
    revokeSession(sessionId) {
        this.sessions.delete(sessionId);
        this.model.revokeSession(sessionId);
    }

    /**
     * Compares a hashed password with a plaintext to see if they match
     * @param {string} plainText 
     * @param {string} hashedPass 
     * @returns {Promise<boolean>}
     */
    verifyHash(plainText, hashedPass) {
        return bcrypt.compare(plainText, hashedPass);
    }
}