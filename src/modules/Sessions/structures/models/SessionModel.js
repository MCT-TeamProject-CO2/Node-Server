import SessionSchema from '../schemas/SessionSchema.js'

/**
 * Insert a session document for a certain user id
 * @param {string} uid The user's UUID
 * @param {string} sessionId A session id
 * @returns {Promise<Object>}
 */
export const createSession = (uid, sessionId) => {
    return new SessionSchema({
        sessionId,
        uid
    }).save();
};

/**
 * Just checks if a session exists, if you need the session use getSession
 * @param {string} sessionId
 * @returns {Promise<boolean>}
 */
export const doesSessionExist = async (sessionId) => {
    const doc = await getSession(sessionId);
    if (!doc) return false;
    return true;
};

/**
 * Returns the entire session document
 * @param {string} sessionId 
 * @returns {Promise<Object>}
 */
export const getSession = (sessionId) => {
    return SessionSchema.findOne({ sessionId }).exec();
};

/**
 * Removes the session from the DB
 * @param {string} sessionId 
 * @returns {Promise<Object>}
 */
export const revokeSession = (sessionId) => {
    return SessionSchema.deleteOne({ sessionId }).exec();
}

export default {
    createSession,
    doesSessionExist,
    getSession,
    revokeSession
};