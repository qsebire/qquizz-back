const express = require('express');
const router = express.Router();

const prisma = require('../config/prismaClient'); // ou ton chemin correct
const { subThemeSchema } = require('../validators');

router.post('/', async (req, res) => {
    const result = subThemeSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const data = result.data;

    try {
        const subTheme = await prisma.subTheme.create({ data });
        res.status(201).json(subTheme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const subThemes = await prisma.subTheme.findMany({
            orderBy: { name: 'asc' },
        });
        res.status(201).json(subThemes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const subThemeId = Number(req.params.id);

    if (!Number.isInteger(subThemeId) || subThemeId <= 0) {
        return res
            .status(400)
            .json({ error: 'ID invalide. Il doit être un entier positif.' });
    }

    try {
        const subTheme = await prisma.subTheme.findUnique({
            where: { id: subThemeId },
        });

        if (!subTheme) {
            return res.status(404).json({ error: 'Thème introuvable.' });
        }

        const deletedSubTheme = await prisma.subTheme.delete({
            where: { id: subThemeId },
        });

        res.status(200).json(deletedSubTheme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
