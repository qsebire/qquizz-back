const express = require('express');
const router = express.Router();

const prisma = require('../config/prismaClient'); // ou ton chemin correct
const { themeSchema } = require('../validators');

router.post('/', async (req, res) => {
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

router.get('/all', async (req, res) => {
    try {
        const themes = await prisma.theme.findMany();
        res.status(201).json(themes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const themeId = Number(req.params.id);

    if (!Number.isInteger(themeId) || themeId <= 0) {
        return res
            .status(400)
            .json({ error: 'ID invalide. Il doit être un entier positif.' });
    }

    try {
        const theme = await prisma.theme.findUnique({
            where: { id: themeId },
        });

        if (!theme) {
            return res.status(404).json({ error: 'Thème introuvable.' });
        }

        const deletedTheme = await prisma.theme.delete({
            where: { id: themeId },
        });

        res.status(200).json(deletedTheme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
