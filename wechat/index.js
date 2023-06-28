const axios = require('axios')
const { writeFileSync, readFileSync } = require('fs')
const sha1 = require('sha1')
const { wxConfig } = require('../config')


/**
 * 获取accessToken
 * 
 * 有效期：2小时（7200s）
 * 唯一
 * 
 * 
 * {
    access_token: '69_DQL65SM-Yg-a5tlPYXiXP5kicfZmQbIEe5OultiJsgs_A2qEpvjdENMBBuGxCcMXyYTiEIIb_KGJ9sYLy_kK85ZkFl95m-spZLovj4F-zDhv5viZfthK5eLnUNICUHbAJAWOB',
    expires_in: 7200
  }
 */

class WeChat {
  constructor() { }

  /**=================================================================================
   * 获取Token
   */
  async getAccessToken() {
    const { appID, appsecret } = wxConfig
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    const { data } = await axios.get(url)
    data.expires_in = Date.now() + (data.expires_in - 300) * 1000
    return data
  };

  /**
   * 保存Token
   * @param {*} access_token  保存的凭据
   */
  saveAccessToken(access_token) {
    access_token = JSON.stringify(access_token)
    writeFileSync('./accessToken.txt', access_token)
  };

  /**
   * 
   * @returns 
   */
  readAccessToken() {
    const text = readFileSync('./accessToken.txt')
    return text.toString()
  };

  /**
   * 检验token有效性
   * @param {*} data 
   */
  isValidAccessToken(data) {
    if (!data && !data.access_token && !data.expires_in) {
      return false;
    }
    return data.expires_in > Date.now()
  }


  async fetchAccessToken() {
    const token = JSON.parse(this.readAccessToken())
    if (token) {
      if (this.isValidAccessToken(token)) {
        return token;
      } else {
        const token = await this.getAccessToken();
        this.saveAccessToken(token)
      }
    } else {
      const token = await this.getAccessToken();
      this.saveAccessToken(token)
    }
    return token.access_token;
  }


  // 验证服务器有效性 ===================================================================
  isValidWxServer(req) {
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = wxConfig;
    const sha1Str = sha1([timestamp, nonce, token].sort().join(''));
    return sha1Str
  }
  // =========================================================================

  // 获取js—sdk 
  async getTicket() {
    const token = await this.fetchAccessToken()
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token.access_token}&type=jsapi`;
    const { data } = await axios.get(url)
    return {
      ticket: data.ticket,
      expires_in: Date.now() + (data.expires_in - 300) * 1000
    }
  };
  /**
 * 保存Token
 * @param {*} ticket  保存的凭据
 */
  saveTicket(ticket) {
    ticket = JSON.stringify(ticket)
    writeFileSync('./ticket.txt', ticket)
  };

  /**
* 
* @returns 
*/
  readTicket() {
    const text = readFileSync('./ticket.txt')
    return text.toString() !== '' ? text.toString() : null
  };

  /**
 * 检验token有效性
 * @param {*} data 
 */
  isValidTicket(data) {
    if (!data && !data.ticket && !data.expires_in) {
      return false;
    }
    return data.expires_in < Date.now()
  }

  async fetchTicker() {
    const data = JSON.parse(this.readTicket())
    if (data) {
      if (this.isValidTicket(data)) {
        return data;
      } else {
        const ticket = await this.getTicket();
        this.saveTicket(ticket)
      }
    } else {
      const ticket = await this.getTicket();
      this.saveTicket(ticket)
    }
    return data.ticket;
  }
}




module.exports = WeChat