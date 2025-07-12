const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const { questionSchema } = require('../validators');

router.post('/', async (req, res) => {
    const questionData = req.body;

    const result = questionSchema.safeParse(questionData);

    if (!result.success) {
        return res
            .status(400)
            .json({ success: false, errors: result.error.format() });
    }

    const { themeId, subThemeId, answers, ...restOfData } = result.data;

    try {
        const question = await prisma.question.create({
            data: {
                ...restOfData,
                theme: {
                    connect: { id: themeId },
                },
                ...(subThemeId && {
                    subTheme: {
                        connect: { id: subThemeId },
                    },
                }),
                answers: {
                    create: answers,
                },
            },
            include: { answers: true },
        });

        res.status(201).json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/random', async (req, res) => {
    try {
        const count = await prisma.question.count();

        if (count === 0) {
            return res
                .status(404)
                .json({ message: 'Aucune question trouvée.' });
        }

        const skip = Math.floor(Math.random() * count);

        const randomQuestion = await prisma.question.findMany({
            skip: skip,
            take: 1,
            include: {
                theme: true,
                subTheme: true,
                answers: true,
            },
        });

        res.status(200).json(randomQuestion[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
