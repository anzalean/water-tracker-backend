import Joi from 'joi';

export const addWaterNoteSchema = Joi.object({
  date: Joi.date().required(),
  amoun: Joi.number().required()
});
