import {Router} from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterCardController, deleteWaterCardController, getDayWaterContoller, getMonthWaterContoller, getTodayWaterContoller, updateWaterCardController } from "../controllers/water.js";
import { addWaterCardSchema, updateWaterCardSchema } from "../validation/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";


const router = Router();

router.post(
  '/waterCard',
  validateBody(addWaterCardSchema),
  ctrlWrapper(addWaterCardController)
);
router.patch(
  '/waterCard/:cardId',
  isValidId,
  validateBody(updateWaterCardSchema),
  ctrlWrapper(updateWaterCardController)
);

router.delete('/deleteWaterCard/:cardId', isValidId, ctrlWrapper(deleteWaterCardController));

router.get(
  '/dayWater',
  ctrlWrapper(getDayWaterContoller),
);
router.get(
  '/monthWater',
  ctrlWrapper(getMonthWaterContoller),
);
router.get(
  '/todayWater',
  ctrlWrapper(getTodayWaterContoller),
);

export default router;
