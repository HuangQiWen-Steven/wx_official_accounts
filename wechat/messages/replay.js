module.exports = (message) => {
  const { MsgType } = message;
  let options = {
    FromUserName: message.FromUserName,
    ToUserName: message.ToUserName,
  };
  if (MsgType === 'text') {
    options.msgType = 'text'
    options.content = '你好啊'
  } else if (MsgType === 'image') {
    options.msgType = 'image';
    options.mediaId = message.MediaId
  } else if (MsgType === 'voice') {
    options.msgType = 'voice';
    options.mediaId = message.MediaId
  } else if (MsgType === 'image') {

  } else if (MsgType === 'image') {

  } else if (MsgType === 'location') {
    content = ``
  } else if (MsgType === 'event') {
    if (message.Event === 'subscribe') {
      content = '欢迎您的关注'
    } else {
      console.log('无期取关')
    }
  }

  return options
}