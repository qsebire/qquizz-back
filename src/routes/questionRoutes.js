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
        const askedIdsParam = req.query.askedIds;
        let askedQuestionIds = [];

        if (askedIdsParam) {
            askedQuestionIds = askedIdsParam
                .split(',')
                .map((id) => parseInt(id.trim(), 10));
        }

        const availableQuestionIds = await prisma.question.findMany({
            where: {
                id: {
                    notIn: askedQuestionIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (availableQuestionIds.length === 0) {
            return res
                .status(404)
                .json({
                    message:
                        "Aucune question disponible. Toutes les questions ont été posées ou il n'y en a pas.",
                });
        }

        const randomIndex = Math.floor(
            Math.random() * availableQuestionIds.length
        );
        const selectedQuestionId = availableQuestionIds[randomIndex].id;

        const randomQuestion = await prisma.question.findUnique({
            where: {
                id: selectedQuestionId,
            },
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
