import express, { Request, Response } from 'express';
import LogModel from '../models/dataModel';
import { io } from '../index';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { category, data } = req.body;

  if (!category) {
    return res.status(400).send('Category is required');
  }

  if (!data) {
    return res.status(400).send('Data is required');
  }

  try {
    const newLog = await LogModel.create({
      category,
      data,
    });

    // Emit a 'logsUpdated' event when data is updated
    io.emit('logsUpdated');

    return res.status(200).json(newLog);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const allLogs = await LogModel.find();
    return res.status(200).json(allLogs);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

export default router;
