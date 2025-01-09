import {Router} from "express";
import { validateBody } from "../middlewares/validateBody";
import { addWaterNoteSchema } from "../validation/water";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { addWaterNoteController } from "../controllers/water";


const router = Router();

router.post(
  '/addWaterNote',
  validateBody(addWaterNoteSchema),
  ctrlWrapper(addWaterNoteController)
);

export default router;
