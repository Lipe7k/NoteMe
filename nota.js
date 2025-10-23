import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  path: String,
  content: String,
  images: [
    {
      name: String,
      path: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Note", noteSchema)