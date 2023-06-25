const { getUserDataAsync, parseXMLAsync, formatMessage } = require('../../utils/tools')
const template = require('./template')
const replay = require('./replay')
const WeChat = require('..')

class Message extends WeChat {
  constructor() {
    super();
  };

  async autoResponseMessage(req, res) {
    const xml = await getUserDataAsync(req)
    const xmlToJsData = await parseXMLAsync(xml)
    const message = formatMessage(xmlToJsData)
    const options = replay(message);
    const temp = template(options)
    res.send(temp)
  }
}

module.exports = Message