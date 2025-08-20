import { model, Schema } from "mongoose";

const  counterSchema=new Schema({
    _id: { type: String, required: true },
    sequenceValue: { type: Number, default: -1 }
})


export const Counter=model("Counter", counterSchema);

export  async function getNextSequence(name:string) {

    const counter= await Counter.findByIdAndUpdate(
        name,
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    )

    return counter?.sequenceValue;
}