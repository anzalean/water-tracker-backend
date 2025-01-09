import {Router} from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterCardController, getDayWaterContoller } from "../controllers/water.js";
import { addWaterCardSchema, gatWaterSumDaySchema } from "../validation/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";


const router = Router();

router.post(
  '/addWaterCard',
  validateBody(addWaterCardSchema),
  ctrlWrapper(addWaterCardController)
);

router.get(
  '/getDayWater',
  validateBody(gatWaterSumDaySchema),
  ctrlWrapper(getDayWaterContoller),
);

export default router;
