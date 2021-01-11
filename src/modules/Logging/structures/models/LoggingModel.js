import LoggingSchema from '../schemas/LoggingSchema.js'

export const createNewLog = (schema) => {
    return new LoggingSchema(schema).save();
}

export default {
    createNewLog
};