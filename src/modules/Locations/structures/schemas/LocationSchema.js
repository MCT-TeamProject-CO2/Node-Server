import mongoose from 'mongoose'

const room = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    position: {
        x: Number,
        y: Number
    }
});

const floor = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    rooms: [room]
});

const building = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    floors: [floor]
});

const floor_plan = new mongoose.Schema({
    tag: { type: Number, required: true },
    svg: String
});

const location = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true, unique: true },
    buildings: [building],
    floor_plans: [floor_plan]
});

export default mongoose.model('locations', location);