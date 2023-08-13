import { getTopMvList } from "../../services/request/vedio"

// pages/main-video/main-video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 发送网络请求
    this.fetchTopMv()
  },
// =========================发送网络请求方法=========================
  async fetchTopMv() {
    const TopMvList = await getTopMvList(this.data.offset)
    // 数据是追加，不是覆盖
    const newValueList = [...this.data.videoList, ...TopMvList.data]
    this.setData({ videoList: newValueList })
    this.data.offset = this.data.videoList.length
    this.data.hasMore = TopMvList.hasMore
  },

  // ========================= 监听上拉和下拉功能 =====================
  onReachBottom() {
    // 数据超出50条无法请求
    if(!this.data.hasMore) return
      this.fetchTopMv()
  },
  async onPullDownRefresh() {
    console.log("下拉刷新");
    // 清空之前的数据
    this.setData({videoList: []})
    this.data.offset = 0,
    this.data.hasMore = true

    // 重新请求新数据
    await this.fetchTopMv()
    
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },

  // ========================= 事件监听方法 ==========================
  // onVideoItemTap(event) {
  //   const item = event.currentTarget.dataset.item
  //   wx.navigateTo({
  //     url: `/pages/detail-video/detail-video?id=${item.id}`,
  //   })
  // }
})