import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  path: String,
  content: String,
});

export default mongoose.model("Note", noteSchema);

