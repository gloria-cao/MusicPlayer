import { cqReqInstance } from './index'

// 获取歌曲详情页面
export function getSongDetail(ids) {
  return cqReqInstance.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}

//  获取歌词的信息
export function getSongLyric(id) {
  return cqReqInstance.get({
    url: '/lyric',
    data:  {
      id
    }
  })
}