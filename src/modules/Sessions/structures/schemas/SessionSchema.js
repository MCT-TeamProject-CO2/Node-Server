import mongoose from 'mongoose'

const sessions = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    uid: { type: String, required: true }
});

export default mongoose.model('sessions', sessions);