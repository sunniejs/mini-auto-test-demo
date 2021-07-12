const automator = require('miniprogram-automator')

automator.launch({
  cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', // 工具 cli 位置，
  projectPath: '/Users/SONG/Documents/github/mini-auto-test-demo/miniprogram', // 注意修改为自己的项目文件地址
}).then(async miniProgram => {
  const page = await miniProgram.reLaunch('/pages/index/index')
  await page.waitFor(500)
  const element = await page.$('.userinfo-avatar')
  console.log(await element.attribute('class'))
  await element.tap()
})

 










// const automator = require('miniprogram-automator')
// describe('index', () => {
//   let miniProgram
//   let page

//   beforeAll(async () => {
//     miniProgram = await automator.launch({
//         cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', // 工具 cli 位置，如果你没有更改过默认安装位置，可以忽略此项
//         projectPath: '/Users/SONG/Documents/demo/miniprogram-demo/mini-demo', // 项目文件地址
//     })
//     page = await miniProgram.reLaunch('/pages/index/index')
//     await page.waitFor(5000)
//   }, 30000)

//   it('点击hello world文本', async () => {
//       await page.waitFor(3000)
//       // 通过.user-motto选择目标元素
//       const tabbar = await page.$('.user-motto')
//       tabbar.tap()
//   })
//   // afterAll(async () => {
//   //   await miniProgram.close()
//   // })
// })

