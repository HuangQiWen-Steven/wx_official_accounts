const axios = require('axios')
const { writeFileSync, readFileSync } = require('fs')

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

  /**
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
    return data.expires_in < Date.now()
  }


  fetchAccessToken() {
    const token = this.readAccessToken();
    if (token) {
      if (this.isValidAccessToken(token)) {
        return token;
      } else {
        const token = this.getAccessToken();
        this.saveAccessToken(token)
      }
    } else {
      const token = this.getAccessToken();
      this.saveAccessToken(token)
    }

  }

}




module.exports = WeChat