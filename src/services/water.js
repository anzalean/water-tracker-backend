import { Water } from "../db/models/water";

export async function addWaterNoteService(waterNote) {
  return Water.create(waterNote);
}
