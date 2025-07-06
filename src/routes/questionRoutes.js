const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const prisma = require('../config/prismaClient');
const fs = require('fs/promises');
const cloudinary = require('../config/cloudinary');
const { questionSchema } = require('../validators');

router.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: './tmp/',
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
        abortOnLimit: true,
        safeFileNames: true,
    })
);

async function uploadImageToCloudinary(file) {
    try {
        const resultCloudinary = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: 'qquizz/questions',
            }
        );
        await fs.unlink(file.tempFilePath);
        return resultCloudinary.secure_url;
    } catch (err) {
        throw new Error("Erreur lors de l'upload de l'image.");
    }
}

router.post('/', async (req, res) => {
    const questionData = req.body;
    const uploadImage = req.files?.image;

    const result = questionSchema.safeParse(questionData);

    if (!result.success) {
        return res
            .status(400)
            .json({ success: false, errors: result.error.format() });
    }

    const data = result.data;
    let mediaUrl = data.mediaUrl;

    if (data.type === 'IMAGE' && !uploadImage && !data.mediaUrl) {
        return res.status(400).json({
            success: false,
            error: 'Une image ou une URL est requise pour ce type de question.',
        });
    }

    try {
        if (data.type === 'IMAGE' && uploadImage) {
            mediaUrl = await uploadImageToCloudinary(uploadImage);
        }

        const question = await prisma.question.create({
            data: {
                ...data,
                mediaUrl,
                answers: {
                    create: data.answers,
                },
            },
            include: { answers: true },
        });

        res.status(201).json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
