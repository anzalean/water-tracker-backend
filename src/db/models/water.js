import { Schema, model, Types } from 'mongoose';

const startDate = new Date('01/01/2024');

const unixDay = 86400000;

const waterSchema = new Schema(
  {
    date: {
      type: Date,
      min: +startDate,
      validate: {
        validator: function (value) {
          return new Date(value) <= Date.now() + unixDay;
        },
        message: 'Date must be less than or equal to the current date.',
      },
      required: true,
    },
    amount: {
      type: Number,
      min: 50,
      max: 5000,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Water = model('Water', waterSchema);
