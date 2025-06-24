const allowedGameModes = ['RAPIDITE', 'TOUTES_LES_EQUIPES', 'UNE_EQUIPE'];
const allowedAnswerModes = ['QCM', 'VRAI_FAUX', 'CASH'];

function validateQuestionType(input) {
    const { gameModes, answerModes } = input;
    if (!gameModes.every((mode) => allowedGameModes.includes(mode))) {
        throw new Error('Game mode invalide');
    }
    if (!answerModes.every((mode) => allowedAnswerModes.includes(mode))) {
        throw new Error('Answer mode invalide');
    }
}

module.exports = { validateQuestionType };
