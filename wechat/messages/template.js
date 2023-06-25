module.exports = (options) => {
  let replayMessage = `<xml>
  <ToUserName><![CDATA[${options.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${options.ToUserName}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType><![CDATA[${options.msgType}]]></MsgType>`

  if (options.msgType === 'text') {
    replayMessage += `
      <Content><![CDATA[${options.content}]]></Content>`
  } else if (options.msgType === 'image') {
    replayMessage += `
      <Image>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      </Image>`
  } else if (options.msgType === 'voice') {
    replayMessage += `
      <Voice>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      </Voice>`
  } else if (options.msgType === 'video') {
    replayMessage += `
      <Video>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
      </Video>`
  } else if (options.msgType === 'music') {
    replayMessage += `
      <Music>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
      </Music>`
  } else if (options.msgType === 'news') {
    replayMessage += `
      <Articles>
        <item>
          <Title><![CDATA[${options.title}]]></Title>
          <Description><![CDATA[${options.description}]]></Description>
          <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
          <Url><![CDATA[${options.url}]]></Url>
        </item>
      </Articles>`
  }


  replayMessage += '</xml>'
  return replayMessage;
}