module.exports = async (userName, password, page, res) => {
  await page.waitForSelector('body');
  if (await page.$('.aOOlW')) await page.click('.aOOlW');

  res.status(200).write(`data: Logging in to your account\n\n`);
  await page.waitForSelector('input[name="username"]');
  await page.click('input[name="username"]');
  await page.keyboard.type(userName);
  await page.click('input[name="password"]');
  await page.keyboard.type(password);

  await Promise.all([
    page.click('button[type=submit]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
};
