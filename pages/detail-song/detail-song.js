// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playStore from "../../store/playStore"
import { getPlayList } from "../../services/request/music"
Page({
  data: {
    songs: [],
    rankingInfo: {},
    key: "",
    type: "ranking",
    id: 0
  },
  onLoad(options) {
    // 获取数据类型 option可以拿到传过来的数据
    // type -> ranking 排行榜 key -> 不同榜单数据
    // type -> recommend 推荐数据
    this.setData({ key: options.key })
    this.setData({ type: options.type })
    if(this.data.type === "ranking") {
      // 拿到榜单数据区分key
      rankingStore.onState(this.data.key, this.handleRankingInfo)
    }else if(this.data.type === "menu") {
      this.data.id = options.id
      // 请求歌单详情
      this.fetchMenuSongInfo()
    }else {
      // 拿到推荐数据
      recommendStore.onState("recommendSongs", this.handleRecommendSongs)
    }
  },
  async fetchMenuSongInfo() {
    // 歌单详情
    const res = await getPlayList(this.data.id)
    this.setData({ rankingInfo: res.playlist })
  },
  handleRecommendSongs(value) {
    this.setData({ songs: value })
  }, 
  handleRankingInfo(value) {
    this.setData({rankingInfo: value})
    // 动态设置navname
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },
  onItemTab() {
    playStore.setState("playSongList", this.data.rankingInfo.tracks)
  },
  onUnload() {
    if(this.data.type === "ranking") {
    rankingStore.offState(this.data.key, this.handleRankingInfo)
    }else {
      recommendStore.offState("recommendSongs", this.handleRecommendSongs)
    }
  }
})