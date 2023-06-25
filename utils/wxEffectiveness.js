const sha1 = require('sha1')
const { getUserDataAsync, parseXMLAsync, formatMessage } = require('../utils/tools')
const template = require('../messages/template')
const replay = require('../messages/replay')
const { wxConfig } = require('../config')
/**
 * 1. 告知微信服务器，开发者服务器地址，并添加token
 * 2.开发者服务器 - 验证消息是否来自于微信服务器
  * {
        signature: '243054eb8847904f5db54ddd146b6fe0af383733',
        echostr: '7919007234040788791',
        timestamp: '1687660064',
        nonce: '1324411763'
      }
* 3.拿到微信服务器返回的值，计算出微信加密签名，和微信返回过来的signature进行对比，如果一样，说明消息来源于微信服务器，反之则不然。
      1.将参数与微信加密签名的三个参数（timestamp、nonce、token）按照字典排序并组合在一起形成一个数组。
      2.将数组里所有参数拼接成一个字符串，进行sha1加密
      3.加密完成就生成一个signature，和微信进行对比。
        - 一样 ：返回echostr给微信
        - 不一样： 返回error
 */

module.exports = () => {
  return async (req, res, next) => {
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = wxConfig;
    const sha1Str = sha1([timestamp, nonce, token].sort().join(''));

    /**
     * GET：
     * POST：微信服务器会将用户发送过来的数据以POST请求的方式转发到微信开发者服务器上
     */
    if (req.method === 'GET') {
      sha1Str === signature ? res.send(echostr) : res.end('error')
    } else if (req.method === 'POST') {
      sha1Str !== signature ? res.end('error') : null
      const xml = await getUserDataAsync(req)
      const xmlToJsData = await parseXMLAsync(xml)
      const message = formatMessage(xmlToJsData)
      const options = replay(message);
      const temp = template(options)
      res.send(temp)
    }
  }
}

