import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Note from "./nota.js";
import deleteRouter from './delete.js';



dotenv.config();

const app = express();


app.use(express.json())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"))
app.use('/delete-image', deleteRouter);


const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
          .then(() => console.log("Conectado ao MongoDB"))
          .catch((err) => console.log("Erro ao conectar com o MongoDB", err))
}
connectDB()

const storage = multer.diskStorage({
  destination: 'uploads/',

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

app.get("/", (req, res) => {
  res.render("home")
});


app.get("/:path", async (req, res) => {
  const { path } = req.params

  let note = await Note.findOne({ path })

  if(!note){
    note = new Note({ path, content: "", images: {}})
    await note.save()
  }

  res.render("note", { note })
})

app.post("/:path", upload.array("images", 5), async (req, res) => {
  const newImages = req.files.map(file => ({
    name: file.originalname,
    path: file.path
  }))

  const { path } = req.params
  const { content } = req.body

  const note = await Note.findOne({ path });

  await Note.findOneAndUpdate({ path }, { content, images: newImages })

  note.images = [...(note.images || []), ...newImages]
  
  await note.save()

  res.redirect(`/${path}`)
})


app.listen(process.env.PORT, () => { console.log(`rodando em localhost:${process.env.PORT}`)})