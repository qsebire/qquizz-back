const { z } = require('zod');
const {
    allowedGameModes,
    allowedAnswerModes,
} = require('../../data/shared/quizzModes');

const gameModesEnum = z.enum(allowedGameModes);
const answerModesEnum = z.enum(allowedAnswerModes);

const questionTypeSchema = z.object({
    name: z.string().min(1, { message: 'Le nom est requis.' }),
    description: z.string().min(1, { message: 'La description est requise.' }),
    gameModes: z
        .array(gameModesEnum)
        .nonempty({ message: 'Au moins un gameMode est requis.' }),
    answerModes: z
        .array(answerModesEnum)
        .nonempty({ message: 'Au moins un answerMode est requis.' }),
    requiresImage: z.boolean(),
    requiresTheme: z.boolean(),
    defaultPrompt: z.string().optional(),
});

module.exports = {
    questionTypeSchema,
};
