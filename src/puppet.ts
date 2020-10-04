import puppeteer from 'puppeteer';

interface Body {
  userName: string;
  password: string;
  hashtag: string;
}
interface Result {
  status: string | number;
}

export const startLiking = async ({
  userName,
  password,
  hashtag,
}: Body): Promise<Result> => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://instagram.com');
    await page.waitForSelector('input[name="username"]');
    await page.click('input[name="username"]');
    await page.keyboard.type(userName);
    await page.click('input[name="password"]');
    await page.keyboard.type(password);
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.goto(`https://instagram.com/explore/tags/${hashtag}`);
    await page.waitForSelector('.eLAPa');
    await page.$$eval('.eLAPa', (photos) => {
      let element: HTMLElement = photos[9] as HTMLElement;
      element.click();
    });

    let keepGoing = true;
    let count = 0;
    // we are now on the first photo to like
    do {
      await page.waitForSelector('.ltpMr ._8-yf5');
      const res = await page.$eval('.ltpMr ._8-yf5', (svg: Element) => {
        const status = svg.getAttribute('aria-label');
        if (status === 'Synes godt om') {
          const wrapper = document.querySelector('.eo2As');
          if (wrapper) {
            const btns = wrapper.querySelectorAll('svg');
            const like = btns[0].closest('button');
            const favorite = btns[3]
              ? btns[3].closest('button')
              : btns[2].closest('button');
            if (like && favorite) {
              like.click();
              favorite.click();
              const continueBtn: HTMLElement = document.querySelector(
                '.coreSpriteRightPaginationArrow'
              ) as HTMLElement;
              if (continueBtn) {
                continueBtn.click();
                return true;
                // loop gets to continue;
              }
            }
          }
        } else {
          return false;
        }
      });
      if (!res) {
        break;
      }
      count++;
    } while (keepGoing);
    await browser.close();
    return { status: count };
  } catch (e) {
    console.log(e);
    return { status: 'error' };
  }
};
