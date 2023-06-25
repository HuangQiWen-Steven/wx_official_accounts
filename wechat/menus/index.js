const axios = require('axios');
const WeChat = require('..');
const menus = require('./data')


class Menu extends WeChat {
  constructor() {
    super();
  };

  async createMenu() {
    const token = await super.fetchAccessToken()
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`;
    // 发送请求
    const { data } = await axios.post(url, menus)
    return data
  }

  async deleteMenu() {
    const token = await super.fetchAccessToken()
    const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`
    const { data } = await axios.get(url)
    return data;
  }

  async settingMenu() {
    // 先删除之前的菜单
    await this.deleteMenu();
    // 添加新的菜单
    await this.createMenu()
    console.log('菜单重置成功')
  }
}

module.exports = Menu