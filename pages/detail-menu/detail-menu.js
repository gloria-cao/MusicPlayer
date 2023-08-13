// pages/detail-menu/detail-menu.js
import { getMenuTag, getHotSongList } from "../../services/request/music"
Page({
  data: {
    songMenus: []
  },
  onLoad() {
    this.fetchMenuList()
  },
  async fetchMenuList() {
    const res = await getMenuTag()
    // this.setData({menuTags: res.tags})

    // 根据tags获取对应歌单
    const allPromise = []
    for(const tag of res.tags) {
      let allPlayList = []
      const promise = getHotSongList(tag.name)
      allPromise.push(promise)
    }

    // 获取所有数据调用一次setData
    Promise.all(allPromise).then(res => {
      this.setData({songMenus: res})
    })
  }
})