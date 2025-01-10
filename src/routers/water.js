import {Router} from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterCardController, deleteWaterCardController, getDayWaterContoller, getMonthWaterContoller, getTodayWaterContoller, updateWaterCardController } from "../controllers/water.js";
import { addWaterCardSchema, updateWaterCardSchema } from "../validation/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";


const router = Router();

router.post(
  '/addWaterCard',
  validateBody(addWaterCardSchema),
  ctrlWrapper(addWaterCardController)
);
router.patch(
  '/updateWaterCard/:cardId',
  isValidId,
  validateBody(updateWaterCardSchema),
  ctrlWrapper(updateWaterCardController)
);

router.delete('/deleteWaterCard/:cardId', isValidId, ctrlWrapper(deleteWaterCardController));

router.get(
  '/getDayWater',
  ctrlWrapper(getDayWaterContoller),
);
router.get(
  '/getMonthWater',
  ctrlWrapper(getMonthWaterContoller),
);
router.get(
  '/getTodayWater',
  ctrlWrapper(getTodayWaterContoller),
);

export default router;
