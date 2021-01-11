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

    get uid() {
        return this._user.uid;
    }

    get user() {
        return this._user;
    }

    isValid(permlevel) {
        const levels = this._module.modules.user.constants.PermissionLevels;
        
        if (levels.indexOf(permlevel) > levels.indexOf(this._user.permission))
            return false;
        return !this._user.disabled;
    }
}