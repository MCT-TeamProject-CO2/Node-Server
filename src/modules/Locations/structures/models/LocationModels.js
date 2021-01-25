import FloorPlanSchema from '../schemas/FloorPlanSchema.js'
import LocationSchema from '../schemas/LocationSchema.js'

export const createIfNotExists = (location) => {
    return new LocationSchema(location).save();
};

export const createSvgDocument = (floorPlan) => {
    return new FloorPlanSchema(floorPlan).save();
};

export const get = (q) => {
    return LocationSchema.findOne(q).exec();
};

/**
 * Return all documents that match a query
 * @param {Object} q
 * @returns {Promise<Array<LocationSchema>>}
 */
export const getAll = (q = {}) => {
    return LocationSchema.find(q).exec();
};

export const getSvgById = (id) => {
    return FloorPlanSchema.findById(id).exec();
};

/**
 * @param {Object} q
 * @param {LocationSchema} location 
 * @returns {Promise<LocationSchema>}
 */
export const update = (q, location) => {
    return LocationSchema.findOneAndUpdate(q, location, { new: true }).exec();
};

export const updateSvgDocument = (q, floorPlan) => {
    return FloorPlanSchema.findOneAndUpdate(q, floorPlan, { new: true }).exec();
};

export default {
    createIfNotExists,
    createSvgDocument,
    get,
    getAll,
    getSvgById,
    update,
    updateSvgDocument
};