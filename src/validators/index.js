const { z } = require('zod');

const themeSchema = z.object({
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

const baseQuestion = {
    question: z.string().min(1, { message: 'La question est requise.' }),
    themeId: z.number().int().positive(),
    userId: z.string().optional(),
    answers: answersSchema,
    answerDetail: z.string().optional(),
};

const questionText = z.object({
    ...baseQuestion,
    type: z.literal('TEXT'),
    imageUrl: z.undefined(),
    videoUrl: z.undefined(),
    audioUrl: z.undefined(),
    emojis: z.undefined(),
});

const questionImage = z.object({
    ...baseQuestion,
    type: z.literal('IMAGE'),
    imageUrl: z.string().url().optional(),
    videoUrl: z.undefined(),
    audioUrl: z.undefined(),
    emojis: z.undefined(),
});

const questionVideo = z.object({
    ...baseQuestion,
    type: z.literal('VIDEO'),
    imageUrl: z.undefined(),
    videoUrl: z.string().url(),
    audioUrl: z.undefined(),
    emojis: z.undefined(),
});

const questionAudio = z.object({
    ...baseQuestion,
    type: z.literal('AUDIO'),
    imageUrl: z.undefined(),
    videoUrl: z.undefined(),
    audioUrl: z.string().url(),
    emojis: z.undefined(),
});

const questionEmoji = z.object({
    ...baseQuestion,
    type: z.literal('EMOJI'),
    imageUrl: z.undefined(),
    videoUrl: z.undefined(),
    audioUrl: z.undefined(),
    emojis: z.string().min(1, { message: 'Au moins un emoji est requis.' }),
});

const questionSchema = z.discriminatedUnion('type', [
    questionText,
    questionImage,
    questionVideo,
    questionAudio,
    questionEmoji,
]);

module.exports = {
    themeSchema,
    questionSchema,
    answerSchema,
};
