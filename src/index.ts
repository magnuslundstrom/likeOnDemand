import express, { Request, Response } from 'express';
import { startLiking } from './puppet';
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'static')));

interface Result {
  status: string | number;
}

app.post('/cred', async (req: Request, res: Response) => {
  const result: Result = await startLiking(req.body);
  console.log(result);

  if (typeof result.status === 'string') {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.listen(3000, () => console.log('lets go'));
