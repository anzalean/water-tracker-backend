import expressAsyncHandler from "express-async-handler";
import { Water } from "../db/models/water.js";
import createHttpError from "http-errors";


export async function addWaterCardService(waterNote) {
  return Water.create(waterNote);
}


export const getDayWater = expressAsyncHandler(async (req, res) => {
  const { _id: owner } = req.user;

  const date = new Date(+req.query.date);

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
