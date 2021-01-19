import LoggingSchema from '../schemas/LoggingSchema.js'

export const createNewLog = (schema) => {
    return new LoggingSchema(schema).save();
}

/** 
 * 
 * @param {Date} start
 * @param {Date} end
 */
export const getInRange = (start, end) => {
    return LoggingSchema.find({datetime: {$gte: start, $lte: end}}).exec();
}

/** 
 * @param {Date} start
 */
export const getDelta = (start) => {
    return LoggingSchema.find({datetime: {"$gte": start}}).exec();
}

export default {
    createNewLog,
    getDelta,
    getInRange
};