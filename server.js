const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const loginStep = require('./puppetSteps/login.js');
const loopPhotos = require('./puppetSteps/loopPhotos.js');

const puppeteer = require('puppeteer');

app.use(cookieParser());
app.use(express.json());

app.post('/set-cookies', (req, res) => {
  res.cookie('user', JSON.stringify(req.body), { maxAge: 9000000000, httpOnly: true });
  res.send('');
});

app.get('/like', async (req, res) => {
  res.set('Content-type', 'text/event-stream');
  res.set(('Connection', 'keep-alive'));
  res.set('Cache-Control', 'no-cache');
  const { userName, password, hashtag } = JSON.parse(req.cookies.user);

  try {
    res.status(200).write(`data: Starting up the process\n\n`);
    const browser = await puppeteer.launch({
      //headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://instagram.com');
    // Login
    await loginStep(userName, password, page, res);
    // Redirect
    res.status(200).write(`data: Finding photos to like\n\n`);
    await page.goto(`https://instagram.com/explore/tags/${hashtag}`);
    // Find first photo under latest
    await page.$$eval('.eLAPa', (photos) => {
      let element = photos[0];
      element.click();
    });

    await loopPhotos(page, res);
    await browser.close();
    res.status(200).write(`data: stop\n\n`);

    setTimeout(() => {
      res.end();
    }, 100);
  } catch (e) {
    res.status(400).write(`data: Something went wrong\n\n`);
    res.status(200).write(`data: stop\n\n`);
    res.end();
    console.log(e);
  }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, './public/index.html'), 'utf-8');
  res.status(200).send(html);
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('lets go'));

//  res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`);
