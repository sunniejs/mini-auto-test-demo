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
