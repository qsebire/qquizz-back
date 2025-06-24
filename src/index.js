const express = require('express');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const cloudinary = require('./config/cloudinary'); // chemin vers ton fichier config
const prisma = require('./config/prismaClient');
const fs = require('fs');
const { questionTypeSchema } = require('./validators/index');

const app = express();

app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: './tmp/', // dossier temporaire sur ton serveur (Linux/macOS)
    })
);

// ===========> Routes

app.post('/question-type', async (req, res) => {
    const result = questionTypeSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const data = result.data;

    try {
        const questionType = await prisma.questionType.create({ data });
        res.status(201).json(questionType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/question-type', async (req, res) => {
    try {
        const questionType = await prisma.questionType.findMany();
        res.status(201).json(questionType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/question', async (req, res) => {
    try {
        const { content } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const imageFile = req.files.image;

        // Upload sur Cloudinary
        const result = await cloudinary.uploader.upload(
            imageFile.tempFilePath,
            {
                folder: 'qquizz/questions',
            }
        );

        // Supprimer fichier temporaire
        fs.unlink(imageFile.tempFilePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });

        // Créer la question avec l'URL de l'image
        const question = await prisma.question.create({
            data: {
                content,
                imageUrl: result.secure_url,
            },
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
