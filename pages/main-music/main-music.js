// pages/main-music/main-music.js
import { throttle } from 'underscore'
import { getBannerList, getPlayList, getHotSongList } from "../../services/request/music"
import { querySelect } from "../../utils/query-select"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playStore from "../../store/playStore"

const querySelectThrottle = throttle(querySelect, 100, {trailing: false})

Page({
  data: {
    searchValue: '',
    bannerList: {},
    // 动态设置轮播图点的位置
    bannerHeight: 130,
    playList: {},
    recommendSongs: {},
    hotSongList: {},
    recomSongList: {},

    // 巅峰帮数据
    rankingInfo: {}
  },
  onLoad() {
    this.fetchBannerList()
    this.fetchHotSongList()
    this.fetchHotSongList("华语")

    // 发起actions
    recommendStore.onState("recommendSongs", this.handleRecommendSongs)
    recommendStore.dispatch("fetchRecommendSongsAction")
    rankingStore.onState("newRanking", this.handleNewRanking)
    rankingStore.onState("originRanking", this.handleOriginRanking)
    rankingStore.onState("upRanking", this.handleUpRanking)

    // 榜单
    rankingStore.dispatch("fetchRankingDataAction")
  },
  // 界面事件监听方法
  handleInputClick() {
    wx.navigateTo({
      url: '../detail-search/detail-search'
    })
  },
  // ========== 网络请求 ============
  async fetchBannerList() {
    const res = await getBannerList()
    this.setData({bannerList: res.banners})
  },
  async fetchHotSongList(cat = "流行") {
    const res = await getHotSongList(cat)
    if (cat === "流行") {
      this.setData({ hotSongList: res.playlists })
    }else if (cat === "华语") {
      this.setData({ recomSongList: res.playlists })
    }
    
  },

  handleImgLoaded(event) {
    // 获取img组件高度, 节流
    querySelectThrottle(".itemImg").then((res) => {
      this.setData({bannerHeight: res[0]?.height})
    })
  },
  onRecommendClick() {
    // 跳转到song页面
    wx.navigateTo({
      url: '../detail-song/detail-song',
    })
  },
  onMenuMoreClick() {
    wx.navigateTo({
      url: '../detail-menu/detail-menu',
    })
  },
  // =========== 从store中获取数据 ===============
  handleRecommendSongs(value) {
    this.setData({recommendSongs: value.slice(0, 6)})
    this.setData({playList: value})
  },
  handleNewRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfo, newRanking: value }
    this.setData({ rankingInfo: newRankingInfos })
  },
  handleOriginRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfo, originRanking: value }
    this.setData({ rankingInfo: newRankingInfos })
  },
  handleUpRanking(value) {
    const newRankingInfos = { ...this.data.rankingInfo, upRanking: value }
    this.setData({ rankingInfo: newRankingInfos })
  },
  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
  },
  // 监听歌曲点击
  onSongItemTab(event) {
    const index = event.currentTarget.dataset.index
    playStore.setState("playSongList", this.data.recommendSongs)
    playStore.setState("playSongIndex", index)
  }
})