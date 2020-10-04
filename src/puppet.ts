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

        console.log('14');
        if (status === 'Like') {
          console.log('15');
          const wrapper = document.querySelector('.eo2As');

          console.log('16');
          if (wrapper) {
            const btns = wrapper.querySelectorAll('svg');

            console.log('17');
            const like = btns[0].closest('button');

            console.log('18');
            const favorite = btns[3]
              ? btns[3].closest('button')
              : btns[2].closest('button');

            console.log('19');
            if (like && favorite) {
              console.log('20');
              like.click();

              console.log('21');
              favorite.click();
              console.log('22');
              const continueBtn: HTMLElement = document.querySelector(
                '.coreSpriteRightPaginationArrow'
              ) as HTMLElement;
              console.log('23');
              if (continueBtn) {
                continueBtn.click();
                console.log('24');
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

console.log('1');
