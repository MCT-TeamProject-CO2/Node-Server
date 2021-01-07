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

    get uid() {
        return this._user.uid;
    }

    get user() {
        return this._user;
    }

    isValid() {
        return !this._user.disabled;
    }
}