import LocationSchema from '../schemas/LocationSchema.js'

export const createIfNotExists = (location) => {
    return new LocationSchema(location).save();
};

/**
 * Return all documents that match a query
 * @param {Object} q 
 * @param {Number} [svg = 0] If SVG's should be returned, default 0, 1 to return SVG's
 * @returns {Promise<Array<LocationSchema>>}
 */
export const getAll = (q = {}, svg = 0) => {
    return LocationSchema.find(q, { floor_plans: { svg } }).exec();
};

/**
 * @param {Object} q
 * @param {LocationSchema} location 
 * @returns {Promise<LocationSchema>}
 */
export const update = (q, location) => {
    return LocationSchema.findOneAndUpdate(q, location, { new: true }).exec();
};

export default {
    createIfNotExists,
    getAll,
    update
};