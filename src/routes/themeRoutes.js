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

module.exports = router;
