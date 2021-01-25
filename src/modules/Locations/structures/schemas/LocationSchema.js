import mongoose from 'mongoose'

const floor_plan = new mongoose.Schema({
    tag: { type: Number, required: true },
    id: { type: mongoose.ObjectId, required: true }
});

const location = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true, unique: true },
    floor_plans: [floor_plan]
});

export default mongoose.model('locations', location);