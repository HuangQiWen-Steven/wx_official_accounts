const express = require('express');
const wxEffectiveness = require('./utils/wxEffectiveness')
const WeChat = require('./utils/accessToken')

const app = express()

const wechar = new WeChat()
wechar.readAccessToken()

// 验证服务器有效性
app.use(wxEffectiveness())

app.listen(80, () => {
  console.log("服务器启动成功")
})