// pages/detail-video/detail-video.js
import { getMvDetail, getMvDetailInfo, getRelativeMvUrl } from "../../services/request/vedio"
Page({
  data: {
    id: 0,
    mvDeatil: {},
    mvInfo: {},
    relativeMv: {}
  },
  // 接收main-video页面传递过来的数据
    onLoad(options) {
    const id = options.id
    this.setData({id: id})
    getMvDetail(id).then((res) => {
      this.setData({mvDeatil: res.data})
    })
    this.fetchGetMvURL()
    this.fetchGetMvDeatil()
    this.fetchGetRelativeMv()
  },
  // 视频
  async fetchGetMvURL() {
    // 必须重新编译
    const res = await getMvDetail(this.data.id)
    this.setData({mvDeatil: res.data})
  },
  // 视频下面的详情
  async fetchGetMvDeatil() {
    const res = await getMvDetailInfo(this.data.id)
    this.setData({mvInfo: res.data})
  },
  // 相关视频
  async fetchGetRelativeMv() {
    const res = await getRelativeMvUrl(this.data.id)
    this.setData({relativeMv: res.data})
  }
})