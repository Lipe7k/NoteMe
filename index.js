import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Note from "./nota.js";

dotenv.config();

const app = express();
const PORT = 3000

app.use(express.json())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
          .then(() => console.log("Conectado ao MongoDB"))
          .catch((err) => console.log("Erro ao conectar com o MongoDB", err))
}

connectDB()


app.get("/", (req, res) => {
  res.render("home")
});


app.get("/:path", async (req, res) => {
  const { path } = req.params

  let note = await Note.findOne({ path })
  if(!note){
    note = new Note({ path, content: ""})
    await note.save()
  }

  res.render("note", { note })
})

app.post("/:path", async (req, res) => {
  const { path } = req.params
  const { content } = req.body

  await Note.findOneAndUpdate({ path }, { content })
  res.redirect(`/${path}`)
})

app.listen(PORT, () => { console.log(`rodando em localhost:${PORT}`)})