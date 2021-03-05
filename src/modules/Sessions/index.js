import BaseModule from './structures/BaseModule.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Redis from 'ioredis'
import Session from './structures/Session.js'

export default class Sessions extends BaseModule {
    _sessions = new Map();
    _ready = false;

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

    get ready() {
        return this._ready;
    }

    get sessions() {
        return this._sessions;
    }

    /**
     * Returns a unique enough session id string
     * @param {UserSchema} user The UUID of the user to assign the session to.
     */
    createSession(user) {
        let sessionId;

        do {
            sessionId = crypto.randomBytes(16).toString('base64');
        } while (this.sessions.has(sessionId));

        const session = new Session(this, sessionId, user);
        // Keep a local copy of our sessions
        this.sessions.set(sessionId, session);

        this.publisher.publish('session_created', session.serialize());

        return sessionId;
    }

    /**
     * @param {string} sessionId
     * @returns {Session}
     */
    async getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    init() {
        this.redis = new Redis({
            port: this.auth.redis.port,
            host: this.auth.redis.host,
            password: this.auth.redis.password,
        });
        this.publisher = this.redis.duplicate();

        this.redis.on('connect', this.onConnect.bind(this));
        this.redis.on('close', this.onDisconnect.bind(this));
        this.redis.on('message', this.onMessage.bind(this))

        this.redis.subscribe('session_created');
        this.redis.subscribe('session_updated');
        this.redis.subscribe('session_revoked');

        return true;
    }

    /**
     * @param {string} sessionId
     * @returns {boolean}
     */
    isSessionValid(sessionId, permLevel) {
        if (!this.ready) return false;

        const session = this.getSession(sessionId);
        if (session) return session.isValid(permLevel);
        return false;
    }

    onConnect() {
        this.log.info('SESSION', 'Connected to redis server');

        this._ready = true;
    }

    onDisconnect() {
        this.log.warn('SESSION', 'Lost connection to redis server');

        this._ready = false;
    }

    onMessage(channel, message) {
        switch (channel) {
            case 'session_created':
                return this.onSessionCreated(message);
            case 'session_revoked':
                return this.onSessionRevoked(message);
        }
    }

    onSessionCreated(data) {
        const session = Session.deserialize(this, data);
        if (this.sessions.has(session.id)) return;

        this.sessions.set(session.id, session);
    }

    onSessionUpdated(data) {

    }

    onSessionRevoked(sessionId) {
        this.sessions.delete(sessionId);
    }

    /**
     * Removes the session from the local cache and from the database
     * @param {string} sessionId 
     */
    revokeSession(sessionId) {
        this.publisher.publish('session_revoked', sessionId);
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