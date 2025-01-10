import Joi from 'joi';

export const addWaterCardSchema = Joi.object({
  date: Joi.date().required(),
  amount: Joi.number().required()
});
export const updateWaterCardSchema = Joi.object({
  date: Joi.date().required(),
  amount: Joi.number().required()
});
