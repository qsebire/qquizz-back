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

const subThemeSchema = z.object({
    name: z.string().min(1, { message: 'Le nom du thème est requis.' }),
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
    subThemeId: z.number().int().positive().optional(),
    userId: z.string().optional(),
    difficulty: difficultySchema,
    answers: answersSchema,
    answerDetail: z.string().optional(),
    allowedAnswerModes: z.array(
        z.enum(['CASH', 'MCQ', 'EITHER_ONE', 'TRUE_FALSE'])
    ),
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

const questionSchema = z
    .discriminatedUnion('type', [questionText, questionMedia, questionEmoji])
    .superRefine((data, ctx) => {
        const answers = data.answers;
        const modes = data.allowedAnswerModes;

        if (modes.includes('TRUE_FALSE')) {
            // TRUE_FALSE only accepted "Vrai" and "Faux"
            const validTrueFalse = ['Vrai', 'Faux'];
            const validAnswers = answers.filter((answer) =>
                validTrueFalse.includes(answer.text)
            );

            if (validAnswers.length !== 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'En mode Vrai ou Faux, les réponses doivent être "Vrai" ou "Faux".',
                    path: ['answers'],
                });
            }

            // if TRUE_FALSE mode selected, it must be the only answerMode
            if (modes.length > 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Le mode Vrai ou Faux ne peut être combiné a un autre mode de réponse.',
                    path: ['allowedAnswerModes'],
                });
            }
        }

        // If only CASH mode is selected, only one answer is accepted
        if (modes.length === 1 && modes[0] === 'CASH') {
            if (answers.length > 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'En mode Question libre, une seule réponse doit être fournie.',
                    path: ['answers'],
                });
            }
        }

        // With MCQ and/or EITHER_ONE modes, minimum two answers
        if (modes.includes('MCQ') || modes.includes('EITHER_ONE')) {
            if (answers.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "En mode QCM ou L'un ou l'autre, au moins deux réponses doivent être proposées.",
                    path: ['answers'],
                });
            }
        }
    });

module.exports = {
    themeSchema,
    subThemeSchema,
    questionSchema,
    answerSchema,
};
