import mongoose from 'mongoose'

const logs = new mongoose.Schema({
    level: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    technical: { type: String, default: null },
    datetime: { type: Date, required: true, default: Date }
});

export default mongoose.model('logs', logs);