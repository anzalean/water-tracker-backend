import { addWaterNoteService } from "../services/water";

export async function addWaterNoteController(req, res) {
  const {date, amount} = req.body;
  const userId = req.user.id;

  const waterNote = {
    date,
    amount,
    owner: userId
  };

  const result = await addWaterNoteService(waterNote);

  res.status(201).send({
    status: 201,
    message: 'Water Note added successfully',
    data: result,
  });
}
