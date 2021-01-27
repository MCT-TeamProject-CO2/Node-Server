import UserSchema from '../schemas/UserSchema.js'

/**
 * Creates a user
 * @param {{
 *  email: string,
 *  type: AccountTypes,
 *  username: [string],
 *  password: [string],
 *  phoneNumber: [string]
 * }} user 
 */
export const createUser = (user) => {
    return new UserSchema(user).save();
};

/**
 * Searches for a user based on an object and removes it from the DB
 * @param {Object} q
 */
export const deleteUser = (q) => {
    return UserSchema.deleteOne(q).exec();
};

/**
 * Find a user based on a user object
 * @param {Object} q 
 * @param {boolean} [getPassword = false] If a password should be returned when fetching the user.
 */
export const getUser = (q, getPassword = false) => {
    return UserSchema
        .findOne(q)
        .select(getPassword ? {} : { password: 0 })
        .exec();
};

/**
 * Find multiple users based on a search query
 * @param {Object} q 
 * @param {boolean} [getPassword = false] If a password should be returned when fetching the user.
 */
export const getUsers = (q, getPassword = false) => {
    return UserSchema
        .find(q)
        .select(getPassword ? {} : { password: 0 })
        .exec();
};

/**
 * Find a user document and update it with an object
 * @param {Object} q 
 * @param {Object} update 
 * @param {boolean} [getPassword = false]
 */
export const updateUser = (q, update, getPassword = false) => {
    return UserSchema
        .findOneAndUpdate(q, update, { new: true })
        .select(getPassword ? {} : { password: 0 })
        .exec();
};

export default {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
};