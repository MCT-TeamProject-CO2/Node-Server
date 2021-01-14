import AlertSchema from '../schemas/AlertSchema.js'

/**
 * Creates a new document if it doesn't exist.
 * @param {{
 *  tagString: string,
 *  ppm: int,
 *  code: int
 * }} alert
 * @returns {boolean} True if a new document was created, false if one already exists.
 */
export const createIfNotExists = async (alert) => {
    const doc = await AlertSchema.findOne({ name: alert.name }).exec();
    if (!doc) {
        await new AlertSchema(alert).save();
        
        return true;
    }
    return false;
};

export const remove = (q) => {
    return AlertSchema.findOneAndDelete(q).exec();
};

/**
 * 
 * @param {Object} q 
 */
export const query = (q) => {
    return AlertSchema.find(q).exec();
};

export default {
    createIfNotExists,
    remove,
    query
};