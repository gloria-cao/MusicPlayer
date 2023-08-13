// 解析歌词
const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString) {
  
  const lyricInfos = []
  const lyricLines = lyricString.split("\n")
  lyricLines.pop()
  for(const lineString of lyricLines) {
    const result = timeReg.exec(lineString)
    const minute = result[1] * 60 * 1000
    const second = result[2] * 1000
    const mSecond = result[3] .length === 2 ? result[3] * 10 : result[3] * 10 / 10
    const time = minute + second + mSecond
    const text = lineString.replace(timeReg, "")
    lyricInfos.push({text, time})
  }
  return lyricInfos
}