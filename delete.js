import express from "express";
import Note from "./nota.js";
const router = express.Router();

router.delete("/", async (req, res) => {
  try {
    const { noteId, imagePath } = req.body;
    if (!noteId || !imagePath) return res.status(400).json({ error: "Dados faltando" });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Nota não encontrada" });

    note.images = note.images.filter(img => img.path !== imagePath);
    await note.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar imagem:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
