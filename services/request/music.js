import { cqReqInstance } from './index'

// 首页轮播图数据
export function getBannerList(type = 2) {
  return cqReqInstance.get({
    url: '/banner',
    data: {
      type
    }
  })
} 

// 热门歌单
export function getHotSongList(cat = "全部", limit = 6, offset = 0) {
  return cqReqInstance.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}

// 获取歌单 新歌 id=3779629 原创 id=2884035 飙升 id=19723756  热歌 id=3778678
export function getPlayList(id) {
  return cqReqInstance.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

// 获取歌单类别
export function getMenuTag() {
  return cqReqInstance.get({
    url: '/playlist/hot'
  })
}