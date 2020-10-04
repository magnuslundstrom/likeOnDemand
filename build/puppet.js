'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.startLiking = void 0;
var puppeteer_1 = __importDefault(require('puppeteer'));
exports.startLiking = function (_a) {
  var userName = _a.userName,
    password = _a.password,
    hashtag = _a.hashtag;
  return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, keepGoing, count, res, e_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 18, , 19]);
          return [
            4 /*yield*/,
            puppeteer_1.default.launch({
              headless: true,
              // defaultViewport: null,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }),
          ];
        case 1:
          browser = _b.sent();
          return [4 /*yield*/, browser.newPage()];
        case 2:
          page = _b.sent();
          return [4 /*yield*/, page.goto('https://instagram.com')];
        case 3:
          _b.sent();
          return [4 /*yield*/, page.waitForSelector('input[name="username"]')];
        case 4:
          _b.sent();
          return [4 /*yield*/, page.click('input[name="username"]')];
        case 5:
          _b.sent();
          return [4 /*yield*/, page.keyboard.type(userName)];
        case 6:
          _b.sent();
          return [4 /*yield*/, page.click('input[name="password"]')];
        case 7:
          _b.sent();
          return [4 /*yield*/, page.keyboard.type(password)];
        case 8:
          _b.sent();
          return [
            4 /*yield*/,
            Promise.all([
              page.click('button[type=submit]'),
              page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]),
          ];
        case 9:
          _b.sent();
          return [
            4 /*yield*/,
            page.goto('https://instagram.com/explore/tags/' + hashtag),
          ];
        case 10:
          _b.sent();
          return [
            4 /*yield*/,
            page.$$eval('.eLAPa', function (photos) {
              var element = photos[9];
              element.click();
            }),
          ];
        case 11:
          _b.sent();
          keepGoing = true;
          count = 0;
          _b.label = 12;
        case 12:
          return [4 /*yield*/, page.waitForSelector('.ltpMr ._8-yf5')];
        case 13:
          _b.sent();
          return [
            4 /*yield*/,
            page.$eval('.ltpMr ._8-yf5', function (svg) {
              var status = svg.getAttribute('aria-label');
              if (status === 'Synes godt om') {
                var wrapper = document.querySelector('.eo2As');
                if (wrapper) {
                  var btns = wrapper.querySelectorAll('svg');
                  var like = btns[0].closest('button');
                  var favorite = btns[3]
                    ? btns[3].closest('button')
                    : btns[2].closest('button');
                  if (like && favorite) {
                    like.click();
                    favorite.click();
                    var continueBtn = document.querySelector(
                      '.coreSpriteRightPaginationArrow'
                    );
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
            }),
          ];
        case 14:
          res = _b.sent();
          if (!res) {
            return [3 /*break*/, 16];
          }
          count++;
          _b.label = 15;
        case 15:
          if (keepGoing) return [3 /*break*/, 12];
          _b.label = 16;
        case 16:
          return [4 /*yield*/, browser.close()];
        case 17:
          _b.sent();
          return [2 /*return*/, { status: count }];
        case 18:
          e_1 = _b.sent();
          console.log(e_1);
          return [2 /*return*/, { status: 'error' }];
        case 19:
          return [2 /*return*/];
      }
    });
  });
};
