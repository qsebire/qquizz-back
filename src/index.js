const express = require('express');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const cloudinary = require('./config/cloudinary'); // chemin vers ton fichier config
const prisma = require('./config/prismaClient');
const fs = require('fs');
const {
    themeSchema,
    questionWithAnswersSchema,
    questionSchema,
} = require('./validators/index');

const app = express();

app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: './tmp/', // dossier temporaire sur ton serveur (Linux/macOS)
    })
);

// ===========> Routes

app.post('/theme', async (req, res) => {
    const result = themeSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const data = result.data;

    try {
        const theme = await prisma.theme.create({ data });
        res.status(201).json(theme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/theme', async (req, res) => {
    try {
        const theme = await prisma.theme.findMany();
        res.status(201).json(theme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/question', async (req, res) => {
    const questionData = req.body;
    const uploadImage = req.files?.image;

    const result = questionSchema.safeParse(questionData);

    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const data = result.data;
    let imageUrl = data.imageUrl;

    if (data.type === 'IMAGE' && !uploadImage && !data.imageUrl) {
        return res.status(400).json({
            error: 'Une image ou une URL est requise pour ce type de question.',
        });
    }

    if (data.type === 'IMAGE' && uploadImage) {
        try {
            const resultCloudinary = await cloudinary.uploader.upload(
                uploadImage.tempFilePath,
                {
                    folder: 'qquizz/questions',
                }
            );

            await fs.unlink(uploadImage.tempFilePath);

            imageUrl = resultCloudinary.secure_url;
        } catch (uploadError) {
            return res
                .status(500)
                .json({ error: "Erreur lors de l'upload de l'image." });
        }
    }

    // Créer la question avec l'URL de l'image
    try {
        const question = await prisma.question.create({
            data: {
                ...data,
                imageUrl,
                answers: {
                    create: data.answers,
                },
            },
            include: { answers: true },
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
