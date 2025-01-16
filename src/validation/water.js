import Joi from 'joi';

export const addWaterCardSchema = Joi.object({
  date: Joi.string().required(),
  amount: Joi.number().required()
});
export const updateWaterCardSchema = Joi.object({
  date: Joi.string().required(),
  amount: Joi.number().required()
});
