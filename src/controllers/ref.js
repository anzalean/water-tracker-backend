export const getDayWater = asyncHandler(async (req, res) => {
  const { _id: owner } = req.user;

  const date = new Date(+req.params.date);

  const userTimezoneOffset = req.user.timezoneOffset  0;

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
    throw HttpError(404, `Info for this day not found`);
  }

  const totalDayWater = foundWaterDayData.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  res.status(200).json({
    date,
    totalDayWater,
    consumedWaterData: foundWaterDayData,
    owner,
  });
});

export const getMonthWater = asyncHandler(async (req, res) => {
  const { _id: owner } = req.user;
  const date = new Date(+req.params.date);

  const userTimezoneOffset = req.user.timezoneOffset  0;

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

  res.status(200).json(result);
});

export const summaryTodayWater = expressAsyncHandler(async (req, res) => {
  const todaySumamryWater = await getSummaryTodayWater();
  res.status(200).json({ todaySumamryWater });
});



const waterSchema = new Schema(
  {
    date: {
      type: Number,
      min: +startDate,
      validate: {
        validator: function (value) {
          return value <= Date.now() + unixDay;
        },
        message: 'Date must be less than or equal to the current date.',
      },
      required: true,
    },
    amount: {
      type: Number,
      min: 10,
      max: 2000,
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
