const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const { questionSchema } = require('../validators');
const { stringCommasToArray } = require('../../utils/hooks');

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

router.get('/', async (req, res) => {
    try {
        const {
            nbr,
            askedIds,
            themeId,
            subThemeId,
            answerModes,
            difficulties,
        } = req.query;

        const nbrQuestions = nbr | 1;
        const askedQuestionIds = stringCommasToArray(askedIds);
        const answerModesArr = stringCommasToArray(answerModes);
        const difficultiesArr = stringCommasToArray(difficulties);

        const availableQuestionIds = await prisma.question.findMany({
            where: {
                id: {
                    notIn: askedQuestionIds,
                },
                themeId: {
                    equals: themeId,
                },
                subThemeId: {
                    equals: subThemeId,
                },
                allowedAnswerModes: {
                    hasSome: answerModesArr,
                },
                difficulty: {
                    in: difficultiesArr,
                },
            },
            select: {
                id: true,
            },
        });

        if (availableQuestionIds.length < nbrQuestions) {
            return res.status(404).json({
                message:
                    "Pas assez de questions disponibles. Toutes les questions ont été posées ou il n'y en a pas.",
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

        res.status(200).json(randomQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
