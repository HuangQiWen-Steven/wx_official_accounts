const express = require('express');
const Message = require('./wechat/messages')
const Menu = require('./wechat/menus')
const WeChat = require('./wechat')
const { url } = require('./config')
const sha1 = require('sha1')

const app = express()
const message = new Message();
const menus = new Menu();
const wechat = new WeChat();

app.set('views', './views');
app.set('view engine', 'ejs')

app.get('/search', async (req, res) => {

  // // 随机字符串
  const noncestr = String(Math.random()).split('.')[1]
  // 时间戳
  const timestamp = Date.now()
  const { ticket } = await wechat.fetchTicker();

  const arr = [
    `jsapi_ticket=${ticket}`,
    `noncestr=${noncestr}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ]

  const signature = sha1(arr.sort().join('&'))

  res.render('search', {
    signature,
    noncestr,
    timestamp
  })
})

// 接受处理所有请求
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
  console.log("服务器启动成功,端口80")
})