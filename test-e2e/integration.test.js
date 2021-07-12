const automator = require('miniprogram-automator');

describe('index', () => {
  let miniProgram;
  let page;
  const wsEndpoint = 'ws://127.0.0.1:9420';
  beforeAll(async() => {
    miniProgram = await automator.connect({
      wsEndpoint: wsEndpoint
    });
  }, 30000);

  it('test index', async() => {
   page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(500)
    const element = await page.$('.userinfo-avatar')
    console.log(await element.attribute('class'))
    await element.tap()
  });
});
 