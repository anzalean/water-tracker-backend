import Joi from 'joi';

export const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required()
});

export const loginUserSchema =Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    avatarURL: Joi.string().uri().optional(),
    name: Joi.string().min(3).max(20).optional(),
    gender: Joi.string().valid("male", "female").optional(),
    weight: Joi.number().min(0).optional(),
    activityTime: Joi.number().min(0).optional(),
    desiredVolume: Joi.number().min(50).max(5000).optional(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
    code: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required()
});
