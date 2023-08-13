import { HYEventStore } from "hy-event-store"

const playStore = new HYEventStore({
  state: {
    // 当前播放列表歌曲
    playSongList: [],
    playSongIndex: 0
  }
})

export default playStore