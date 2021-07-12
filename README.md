

### 背景

随着小程序项目越来越复杂，业务场景越来多，花费在回归测试上的时间会越来越多，前端自动化测试就非常有必要提上日程。

今天要带来的是: **小程序自动化测试入门教程**。
### 环境
系统 ：macOS  
微信开发者工具版本: 1.05.2106300

### 什么是小程序自动化

微信官方文档：[小程序自动化 ](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/)

使用小程序自动化 SDK` miniprogram-automator`，可以在帮助我们在小程序中完成一些事情，比如：控制小程序跳转到指定页面，获取小程序页面数据，获取小程序页面元素状态等。

配合 [jest](https://www.jestjs.cn/) 就可以实现小程序端自动化测试了。
话不多说，我们开始吧

### 准备

 1. 项目根目录 `mini-auto-test-demo` 里面准备两个目录 `miniprogram`  放小程序代码，和 `test-e2e` 放测试用例代码 

       
```js
 |— mini-auto-test-demo/  // 根目录
    |— miniprogram/       // 小程序代码
       |— pages/    
           |— index/      // 测试文件
    |— test-e2e/          // 测试用例代码
    |— index.spec.js    // 启动文件
    |— package.json
```
index 文件夹下准备用于测试的页面
 
```js
<!--index.wxml-->
  <view class="userinfo">
      <view class="userinfo-avatar" bindtap="bindViewTap">
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <open-data type="userNickName"></open-data>
  </view>
  
  /**index.wxss**/
.userinfo {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
}
.userinfo-avatar {
  overflow: hidden;
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}
 
// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }
})
```

2. 微信开发者工具->设置-> 安全设置 -> 打卡服务端口

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/998c3546d0f74597bd5059fdae65624c~tplv-k3u1fbpfcp-watermark.image)

3. 安装npm包
如果根目录没有 `package.json` 文件，先执行

```js
npm init
```

如果根目录已经有 `package.json` 文件 ，执行以下命令：

```js
npm install miniprogram-automator jest --save-dev
npm i jest -g
```
安装需要的依赖

4. 在根目录下新建`index.spec.js` 文件

```js
const automator = require('miniprogram-automator')

automator.launch({
  cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', // 工具 cli 位置
  projectPath: '/Users/SONG/Documents/github/mini-auto-test-demo/miniprogram', // 项目文件地址
}).then(async miniProgram => {
  const page = await miniProgram.reLaunch('/pages/index/index')
  await page.waitFor(500)
  const element = await page.$('.userinfo-avatar')
  console.log(await element.attribute('class'))
  await element.tap()
  await miniProgram.close()
})

```
#### 这里要注意修改为自己的cli位置和项目文件地址：

1. cliPath:

可以在应用程序中找到微信开发者工具，点击右键点击"显示包内容"

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/200f2e95920f45698a9c6b11f1efe24e~tplv-k3u1fbpfcp-watermark.image)

找到cli后，快捷键 ：`command+option+c` 复制路径, 就拿到了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57dc60820aae43f2932437f584deb4e9~tplv-k3u1fbpfcp-watermark.image)


2. projectPath:

注意!!项目路径填写的是小程序文件夹`miniprogram`而不是`mini-auto-test-demo`


### 启动

写好路径后，在mac终端进入`mini-auto-test-demo`根目录或 vscode 终端根目录执行命令：

```js
node index.spec.js
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a67bc2ecd0b4f7db4b08dca8e3c9ae0~tplv-k3u1fbpfcp-watermark.image)

你会发现微信开发者工具被自动打开，并执行了点击事件进入了log页面，终端输出了class的值。
到此你已经感受到了**自动化**，接下来你要问了，自动化测试呢？别急，接着往下看。

### 自动化测试

在一开始准备的`test-e2e` 文件夹下新建`integration.test.js`文件，

引入`'miniprogram-automator`, 连接自动化操作端口，把刚刚`index.spec.js`中的测试代码，放到 jest `it` 里，jest相关内容我们这里就不赘述了，大家可以自行学习（其实我也才入门￣□￣｜｜）。

```js
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
 
 
```
在`package.json` scripts 添加命令

```js
"e2e": "jest ./test-e2e integration.test.js --runInBand"
```


测试代码写好了，接下来如何运行呢？这里我们提另外一个方法。

### cli 命令行调用

官方文档：[命令行调用](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)  
你一定会问，刚刚我们不是学习了启动运行，这么还要学另外一种方法 o(╥﹏╥)o 
大家都知道，一般团队里都是多人合作的，大家的项目路径都不一样，难道每次还要改projectPath吗？太麻烦了，使用cli就不需要考虑在哪里启动，项目地址在哪里，话不多说，干！


打开终端进入放微信开发者工具cli文件夹（路径仅供参考）：

```js
cd /Applications/wechatwebdevtools.app/Contents/MacOS 
```
执行命令（如果你的微信开发者工具开着项目，先关掉）

```js
./cli --auto  /Users/SONG/Documents/github/mini-auto-test-demo/miniprogram  --auto-port 9420
```
微信开发者工具通过命令行启动

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e76f9a5b5ef476ea84cf142c1ddc079~tplv-k3u1fbpfcp-watermark.image)

启动后在项目根目录下执行,可以看到测试通过

```js
npm run e2e
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72cea710f66f4553a649ecaa206b3a7e~tplv-k3u1fbpfcp-watermark.image)

到此，我们已经可以写测试用例了。这只是入门系列，后续会持续更文，感谢大家的耐心阅读，如果你有任何问题都可以留言给我，摸摸哒
### github


### 关于我

微信搜索公众号：'前端女塾'，或扫描二维码 。回复"前端"找到我，加入”前端仙女群“，快来组织在等你~

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b97362a26b74270a56bd340e73ab3de~tplv-k3u1fbpfcp-zoom-1.image)


最后，如果文章对你有用就给我点个赞吧，你的每一个点赞我都认真的当成了喜欢~







