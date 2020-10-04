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
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log('1');
    const page = await browser.newPage();

    console.log('2');
    await page.goto('https://instagram.com');

    console.log('3');
    await page.waitForSelector('input[name="username"]');

    console.log('4');
    await page.click('input[name="username"]');

    console.log('5');
    await page.keyboard.type(userName);

    console.log('6');
    await page.click('input[name="password"]');

    console.log('7');
    await page.keyboard.type(password);

    console.log('8');
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    console.log('9');
    await page.goto(`https://instagram.com/explore/tags/${hashtag}`);

    console.log('10');
    await page.waitForSelector('.eLAPa');

    console.log('11');
    await page.$$eval('.eLAPa', (photos) => {
      let element: HTMLElement = photos[9] as HTMLElement;

      console.log('12');
      element.click();
    });

    let keepGoing = true;
    let count = 0;
    // we are now on the first photo to like
    do {
      await page.waitForSelector('.ltpMr ._8-yf5');

      console.log('13');
      const res = await page.$eval('.ltpMr ._8-yf5', (svg: Element) => {
        const status = svg.getAttribute('aria-label');

        if (status === 'Like') {
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
              console.log('23');
              if (continueBtn) {
                continueBtn.click();
                // loop gets to continue;
              }
              return true;
            }
          }
        }
      });
      if (!res) {
        break;
      } else {
        count++;
      }
      await page.waitFor(Math.random() * 3);
    } while (keepGoing);
    await browser.close();
    return { status: count };
  } catch (e) {
    console.log(e);
    return { status: 'error' };
  }
};

console.log('1');
