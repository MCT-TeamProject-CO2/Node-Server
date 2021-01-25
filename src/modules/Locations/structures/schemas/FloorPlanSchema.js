import mongoose from 'mongoose'

const floor_plan = new mongoose.Schema({
    tag: { type: Number },
    svg: { type: Buffer }
});

export default mongoose.model('floorplan', floor_plan);