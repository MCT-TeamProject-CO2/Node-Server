import mongoose from 'mongoose'

const sessions = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    is_token: { type: Boolean, default: false }
});

export default mongoose.model('sessions', sessions);