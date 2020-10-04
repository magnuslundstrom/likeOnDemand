import express, { Request, Response } from 'express';
import { startLiking } from './puppet';
const path = require('path');
console.log('test');

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

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('lets go'));
