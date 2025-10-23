import express from "express";
import Note from "./nota.js";
import fs from "fs";
import path from "path";

const router = express.Router();

router.delete("/", async (req, res) => {
  const { noteId, imagePath } = req.body;

  if (!noteId || !imagePath) {
    return res.status(400).json({ error: "Faltando noteId ou imagePath" });
  }

  try {
    const note = await Note.findById(noteId.trim());
    if (!note) return res.status(404).json({ error: "Note não encontrada" });

    const imageExists = note.images.some(img => img.path === imagePath);
    if (!imageExists) return res.status(404).json({ error: "Imagem não encontrada no Note" });

    note.images = note.images.filter(img => img.path !== imagePath);
    await note.save();

    // Opcional: deletar do disco se o path for relativo à pasta uploads
    const filePath = path.join("uploads", path.basename(imagePath));
    fs.unlink(filePath, err => {
      if (err) console.log("Erro ao deletar arquivo do disco:", err);
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar imagem:", err);
    res.status(500).json({ error: "Erro interno ao deletar imagem" });
  }
});

export default router;
