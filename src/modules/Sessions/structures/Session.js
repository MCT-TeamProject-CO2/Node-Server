export default class Session {
    /**
     * @param {Sessions} module
     * @param {string} sessionId 
     * @param {UserSchema} user 
     */
    constructor(module, sessionId, user) {
        this._module = module;
        this._sessionId = sessionId;
        this._user = user;
    }

    get id() {
        return this._sessionId;
    }

    get permLevel() {
        return this.user.permission;
    }

    get uid() {
        return this._user.uid;
    }

    get user() {
        return this._user;
    }

    isValid(permlevel) {
        const levels = this._module.modules.user.constants.PermissionLevels;

        if (levels.indexOf(permlevel) > levels.indexOf(this.permLevel))
            return false;
        return !this._user.disabled;
    }

    static deserialize(module, string) {
        const session = JSON.parse(string);

        return new Session(module, session.sessionId, session.user);
    }

    serialize() {
        return JSON.stringify({
            sessionId: this.id,
            user: this.user
        });
    }
}