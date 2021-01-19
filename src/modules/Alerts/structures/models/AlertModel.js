import Alert from '../../index.js';
import AlertSchema from '../schemas/Alertschema.js'

/**
 * Creates a new document if it doesn't exist.
 * @param {{
 *  tagString: string,
 *  ppm: int,
 *  code: int
 * }} alert
 * @returns {boolean} True if a new document was created, false if one already exists.
 */
export const create = async (alert) => {
    return await new AlertSchema(alert).save();
};

export const findBetweenDates = (start, end = new Date()) => {
    console.log(end - start);

    return AlertSchema.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).sort({ createdAt: -1 }).exec();
};

export const getLatestAlertForTagstring = (tagString) => {
    return AlertSchema.find({ tagString }).sort({ createdAt: -1 }).limit(1).exec();
};

/**
 * 
 * @param  {...any} args 
 */
export const query = (...args) => {
    return AlertSchema.find(...args).exec();
};

/**
 * Remove an alert based on a query
 * @param {Object} q 
 */
export const remove = (q) => {
    return AlertSchema.findOneAndDelete(q).exec();
};

/**
 * 
 * @param {string} id 
 * @param {Object} update 
 */
export const updateId = (id, update) => {
    return AlertSchema.findByIdAndUpdate(id, update, { new: true }).exec();
}

export default {
    create,
    findBetweenDates,
    getLatestAlertForTagstring,
    query,
    remove,
    updateId
};