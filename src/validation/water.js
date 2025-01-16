import Joi from 'joi';

// export const addWaterCardSchema = Joi.object({
//   date: Joi.date().required(),
//   amount: Joi.number().required()
// });
// export const updateWaterCardSchema = Joi.object({
//   date: Joi.date().required(),
//   amount: Joi.number().required()
// });


export const addWaterCardSchema = Joi.object({
  date: Joi.string()
    .iso()  // Перевірка формату ISO 8601
    .required()
    .example('2025-01-05T17:20:38.936Z')
    .description('Water card creation date in ISO 8601 format'),
  amount: Joi.number()
    .min(0)  // Мінімальне значення
    .max(5000)  // Максимальне значення
    .required()
    .example(50)
    .description('Amount of water in milliliters'),
  owner: Joi.string()
    .required()
    .example('677abe02f27bdbf2cc19d845')
    .description('User id who owns the water card'),
  id: Joi.string()
    .required()
    .example('6776a2cecf4ab2a20b383055')
    .description('Unique identifier of the water card')
});

export const updateWaterCardSchema = Joi.object({
  date: Joi.string()
    .iso()  // Перевірка формату ISO 8601
    .required()
    .example('2025-01-05T17:20:38.936Z')
    .description('Water card creation date in ISO 8601 format'),
  amount: Joi.number()
    .min(0)  // Мінімальне значення
    .max(5000)  // Максимальне значення
    .required()
    .example(50)
    .description('Amount of water in milliliters'),
  owner: Joi.string()
    .required()
    .example('677abe02f27bdbf2cc19d845')
    .description('User id who owns the water card'),
  id: Joi.string()
    .required()
    .example('6776a2cecf4ab2a20b383055')
    .description('Unique identifier of the water card')
});
