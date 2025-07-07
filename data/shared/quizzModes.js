const allowedGameModes = ['SPEED', 'ALL_TEAMS', 'ONE_TEAM'];
const allowedAnswerModes = ['MCQ', 'TRUE_FALSE', 'CASH'];
const questionTypes = ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'EMOJI'];
const difficulties = [
    { level: 1, name: 'Facile' },
    { level: 2, name: 'Moyen' },
    { level: 3, name: 'Difficile' },
    { level: 4, name: 'Hardcore' },
];

module.exports = {
    allowedGameModes,
    allowedAnswerModes,
    questionTypes,
    difficulties,
};
