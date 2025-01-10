import expressAsyncHandler from "express-async-handler";
import { Water } from "../db/models/water.js";
import createHttpError from "http-errors";
import { endOfMonth, startOfMonth } from "date-fns";


export async function addWaterCardService(waterNote) {
  return Water.create(waterNote);
}

export const updateWaterCardService = async (cardId, card) => {
  return Water.findOneAndUpdate(
    { _id: cardId, owner: card.owner },
    card,
    {
      new: true,
    },
  );
};

export const deleteWaterCardService = async (cardId, owner) => {
  return Water.findOneAndDelete({ _id: cardId, owner });
};


export const getDayWaterService = expressAsyncHandler(async (req, res) => {
  const { _id: owner } = req.user;

  const date = new Date(+req.params.date);

  console.log(date);


  const userTimezoneOffset = req.user.timezoneOffset || 0;

  const startOfDay = new Date(date);
  startOfDay.setHours(0 - userTimezoneOffset / 60, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23 - userTimezoneOffset / 60, 59, 59, 999);

  const utcStart = startOfDay.getTime();
  const utcEnd = endOfDay.getTime();

  const foundWaterDayData = await Water.find({
    owner,
    date: {
      $gte: utcStart,
      $lt: utcEnd,
    },
  });

  if (!foundWaterDayData) {
    throw createHttpError(404, `Info for this day not found`);
  }

  const totalDayWater = foundWaterDayData.reduce(
    (acc, item) => acc + item.amount,
    0,
  );
  return {
    date,
    totalDayWater,
    consumedWaterData: foundWaterDayData,
    owner,
  };
});


export const getMonthWaterService = expressAsyncHandler(async (req, res) => {
  const { _id: owner } = req.user;
  const date = new Date(+req.params.date);

  const userTimezoneOffset = req.user.timezoneOffset || 0;

  const startOfMonthDate = startOfMonth(date);
  const endOfMonthDate = endOfMonth(date);

  const startOfDay = new Date(startOfMonthDate);
  startOfDay.setHours(0 - userTimezoneOffset / 60, 0, 0, 0);

  const endOfDay = new Date(endOfMonthDate);
  endOfDay.setHours(23 - userTimezoneOffset / 60, 59, 59, 999);

  const utcStart = startOfDay.getTime();
  const utcEnd = endOfDay.getTime();

  const foundWaterMonthData = await Water.find({
    owner,
    date: {
      $gte: utcStart,
      $lt: utcEnd,
    },
  });

  const aggregatedData = foundWaterMonthData.reduce((acc, item) => {
    const date = new Date(item.date);
    const day = date.getDate();

    if (!acc[day]) {
      acc[day] = {
        date: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
        totalDayWater: 0,
      };
    }
    acc[day].totalDayWater += item.amount;

    return acc;
  }, {});

  const result = Object.values(aggregatedData);
  return result;
  // res.status(200).json(result);
});
