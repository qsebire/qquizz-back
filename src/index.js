const express = require('express');
const cors = require('cors');

require('dotenv').config();

const themeRoutes = require('./routes/themeRoutes');
const subThemeRoutes = require('./routes/subThemeRoutes');
const questionRoutes = require('./routes/questionRoutes');
const { URL_FRONTEND } = require('../data/general');

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: URL_FRONTEND,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// Routes
app.use('/theme', themeRoutes);
app.use('/subtheme', subThemeRoutes);
app.use('/question', questionRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
