const { parseString } = require('xml2js')
/**
 * 获取微信服务器返回数据
 * @param {*} req 
 * @returns 
 */
const getUserDataAsync = (req) => {
  return new Promise((resolve, reject) => {
    let xmlData = '';
    req
      .on('data', data => {
        xmlData += data
      })
      .on('end', () => {
        resolve(xmlData)
      })
  })
}

const parseXMLAsync = (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml, { trim: true }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject('parseXMLAsync方法出现了问题' + err)
      }
    })
  })
}

const formatMessage = (xmlToJsData) => {
  let message = {};
  xmlToJsData = xmlToJsData.xml
  for (let key in xmlToJsData) {
    message[key] = xmlToJsData[key][0]
  }
  return message;
}

module.exports = { getUserDataAsync, parseXMLAsync, formatMessage }