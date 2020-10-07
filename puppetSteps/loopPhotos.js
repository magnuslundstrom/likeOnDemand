module.exports = async (page, res) => {
  let keepGoing = true;
  let count = 0;
  let streak = 0;
  // we are now on the first photo to like

  while (keepGoing && streak <= 5) {
    await page.waitForSelector('.ltpMr ._8-yf5');
    const liked = await page.$eval('.ltpMr ._8-yf5', (svg) => {
      const likeStatus = svg.getAttribute('aria-label');
      if (likeStatus !== 'Like' && likeStatus !== 'Synes godt om') {
        return true;
      } else false;
    });

    if (liked) {
      streak++;
      res.status(200).write(`data: alreadyLikedStreak:${streak}\n\n`);
    }

    if (!liked) {
      const likeButton = await findLikeButton(page);
      const saveButton = await findSaveButton(page);
      await likeButton.click();
      if (saveButton) {
        await saveButton.click();
      }

      streak = 0;
      count++;
      const currentUrl = await page.url();
      res.status(200).write(`data: ["${currentUrl}",${count}]\n\n`);
    }

    const canContinueBtn = await page.$('.coreSpriteRightPaginationArrow');
    if (canContinueBtn) {
      await canContinueBtn.click();
    } else {
      keepGoing = false;
      res.status(200).write(`data: finalCount:${count}\n\n`);
    }

    console.log(streak);
    console.log(count);
    await randomDelay(3);
  }
};

async function randomDelay(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, Math.random() * num * 1000);
  });
}

async function findLikeButton(page) {
  return (await page.$('[aria-label="Like"]'))
    ? await page.$('[aria-label="Like"]')
    : await page.$('[aria-label="Synes godt om"]');
}

async function findSaveButton(page) {
  return (await page.$('[aria-label="Gem"]'))
    ? await page.$('[aria-label="Gem"]')
    : await page.$('[aria-label="Save"]');
}
