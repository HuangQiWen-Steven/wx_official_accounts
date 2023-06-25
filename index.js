const express = require('express');
const Message = require('./wechat/messages')
const Menu = require('./wechat/menus')
const WeChat = require('./wechat')

const app = express()
const message = new Message();
const menus = new Menu();
const wechat = new WeChat();



// 验证服务器有效性
app.use((req, res, next) => {
  const { signature, echostr } = req.query;

  // 检验服务是否是微信服务器发送过来的
  const sha1Str = wechat.isValidWxServer(req)
  /**
   * GET：用于验证个人服务器是否配置成功
   * POST：微信服务器会将用户发送过来的数据以POST请求的方式转发到微信开发者服务器上
   */
  if (req.method === 'GET') {
    sha1Str === signature ? res.send(echostr) : res.end('error')
  } else if (req.method === 'POST') {
    sha1Str !== signature ? res.end('error') : null
    // 消息自动回复
    message.autoResponseMessage(req, res)
    // 设置菜单
    menus.settingMenu()
  }
})

app.listen(80, () => {
  console.log("服务器启动成功")
})