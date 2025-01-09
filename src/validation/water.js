import Joi from 'joi';

export const addWaterCardSchema = Joi.object({
  date: Joi.date().required(),
  amount: Joi.number().required()
});
export const gatWaterSumDaySchema = Joi.object({
  date: Joi.date().required()
});
