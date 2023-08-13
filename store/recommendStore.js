// 推荐歌曲共享数据
import { HYEventStore } from "hy-event-store"
import { getPlayList } from "../services/request/music"

const recommendStore = new HYEventStore({
  state: {
    recommendSongs: []
  },
  // 发送网络请求
  actions: {
    async fetchRecommendSongsAction(ctx) {
      const res = await getPlayList(3779629)
      ctx.recommendSongs = res.playlist.tracks
    }
  }
})

export default recommendStore
