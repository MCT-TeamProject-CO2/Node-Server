export default class Session {
    /**
     * 
     * @param {string} sessionId 
     * @param {UserSchema} user 
     */
    constructor(sessionId, user) {
        this._sessionId = sessionId;
        this._user = user;
    }

    get id() {
        return this._sessionId;
    }

    get user() {
        return this._user;
    }
}