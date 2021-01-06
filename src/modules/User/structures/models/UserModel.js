import UserSchema from '../schemas/UserSchema.js'

/**
 * Creates a user
 * @param {{
 *  email: string,
 *  type: AccountTypes,
 *  username: [string],
 *  password: [string]
 * }} user 
 */
export const createUser = (user) => {
    return new UserSchema(user).save();
};

/**
 * Searches for a user based on an object and updates the user to be disabled
 * @param {Object} q 
 */
export const disableUser = (q) => {
    return updateUser(q, { disabled: true });
};

/**
 * Find a user based on a user object
 * @param {Object} q 
 */
export const getUser = (q) => {
    return UserSchema.findOne(q).exec();
};

/**
 * Find multiple users based on a search query
 * @param {Object} q 
 */
export const getUsers = (q) => {
    return UserSchema.find(q).exec();
};

/**
 * Find a user document and update it with an object
 * @param {Object} q 
 * @param {Object} update 
 */
export const updateUser = (q, update) => {
    return UserSchema.findOneAndUpdate(q, update, { new: true }).exec();
};

export default {
    createUser,
    disableUser,
    getUser,
    getUsers,
    updateUser
};