import mongoose from 'mongoose'

const logs = new mongoose.Schema({
    level: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    technical: { type: String, default: null }
});

export default mongoose.model('logs', logs);