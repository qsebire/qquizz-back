const { z } = require('zod');
const emojiRegex = require('emoji-regex');
const { difficulties } = require('../../data/shared/quizzModes');

const regexEmoji = emojiRegex();

const themeSchema = z.object({
    name: z.string().min(1, { message: 'Le nom du thème est requis.' }),
    smiley: z
        .string()
        .min(1, { message: 'Un emoji est requis.' })
        .regex(regexEmoji, {
            message:
                'Le champ doit contenir uniquement un emoji unicode valide.',
        }),
});

const answerSchema = z.object({
    text: z.string().min(1, { message: 'La réponse est requise.' }),
    isCorrect: z.boolean(),
});

const answersSchema = z
    .array(answerSchema)
    .min(2, { message: 'Au moins deux réponses sont requises.' })
    .refine((answers) => answers.filter((a) => a.isCorrect).length === 1, {
        message: 'Une seule réponse doit être correcte.',
    });

const validLevels = difficulties.map((difficulty) => difficulty.level);
const difficultySchema = z.union(validLevels.map(z.literal));

const baseQuestion = {
    question: z.string().min(1, { message: 'La question est requise.' }),
    themeId: z.number().int().positive(),
    userId: z.string().optional(),
    difficulty: difficultySchema,
    answers: answersSchema,
    answerDetail: z.string().optional(),
};

const questionText = z.object({
    ...baseQuestion,
    type: z.literal('TEXT'),
    mediaUrl: z.undefined(),
    emojis: z.undefined(),
});

const questionMedia = z.object({
    ...baseQuestion,
    type: z.enum(['IMAGE', 'VIDEO', 'AUDIO']),
    mediaUrl: z.string().url().optional(),
    emojis: z.undefined(),
});

const questionEmoji = z.object({
    ...baseQuestion,
    type: z.literal('EMOJI'),
    mediaUrl: z.undefined(),
    emojis: z.string().min(1, { message: 'Au moins un emoji est requis.' }),
});

const questionSchema = z.discriminatedUnion('type', [
    questionText,
    questionMedia,
    questionEmoji,
]);

module.exports = {
    themeSchema,
    questionSchema,
    answerSchema,
};
