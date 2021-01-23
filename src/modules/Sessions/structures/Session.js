export default class Session {
    /**
     * @param {Sessions} module
     * @param {string} sessionId 
     * @param {UserSchema} user 
     */
    constructor(module, sessionId, user = null) {
        this._module = module;
        this._sessionId = sessionId;
        this._user = user;
        
        this._is_token = user ? false : true;
    }

    get id() {
        return this._sessionId;
    }

    get permLevel() {
        return this._is_token ? 'info' : this.user.permission;
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
        return this._is_token ? false : !this._user.disabled;
    }
}