// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/request/player"
import { parseLyric } from "../../utils/parseLyric"
import { throttle } from "underscore"
import playStore from "../../store/playStore"
const app = getApp()

// 创建播放器
const audioContent = wx.createInnerAudioContext()
Page({
  data: {
    id: 0,
    pageTitle: ["歌曲", "歌词"],
    currentSong: {},
    currentLysic: {},
    currentLysic: "",
    lyricInfos: [],
    lyricScrollTop: 0,
    currentIndex: 0,
    statusHeight: 20,
    currentPage: 0,
    contentHeight: 0,

    currentTime: 0,
    durationTime: 0,
    siderValue: 0,
    isSliderChanging: false,

    play: true,

    playSongList: [],
    playSongIndex: 0,
    firstPlay: true,
    playModeIndex: 0, // 0顺序、1单曲、2随机
    modeName: "cycle"
  },
  onLoad(options) {
    // 设置轮播图高度
    this.setData({ contentHeight: app.globalData.contentHeight })
    const id = options.id
    this.setData({ id: id })

    // 加载歌曲
    this.setupPlaySong(id)

    // 获取store的共享数据
    playStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHander)
  },
  updateProgress() {
      // 记录当前时间
      // 设置滑块
      const siderValue = (this.data.currentTime / this.data.durationTime) * 100
      this.setData({siderValue, currentTime: audioContent.currentTime * 1000})
  },
  async fetschSongDetail() {
    const res = await getSongDetail(this.data.id)
    this.setData({ currentSong: res.songs[0] })
  },
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    const lyricString = res.lrc.lyric
    const lyricInfos = parseLyric(lyricString)
    this.setData({lyricInfos})
  },
  returnLast() {
    wx.navigateBack()
  },

  // 播放歌曲的逻辑
  setupPlaySong() {
        // 获取歌曲详情
        this.fetschSongDetail().then((res) => {
          this.setData({durationTime: this.data.currentSong.dt})
        })
        this.fetchSongLyric()
    
        // 播放当前歌曲
        audioContent.stop()
        audioContent.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
        audioContent.autoplay = true

        // 监听播放进度
        if(this.data.firstPlay) {
        this.data.firstPlay = false
        const throtleUpdateProgress = throttle(this.updateProgress, 800, {leading: false, trailing: false})
        audioContent.onTimeUpdate(() => {
          // 更新歌曲进度
          if(!this.data.isSliderChanging) {
            throtleUpdateProgress()
          }
    
          // 更新歌词
          if(!this.data.lyricInfos.length) return
          // 最后一句匹配不上
          let index = this.data.lyricInfos.length - 1
          for(let i = 0; i < this.data.lyricInfos.length; i++) {
            const info = this.data.lyricInfos[i]
            if(info.time > audioContent.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          if(this.data.currentIndex === index) return
          // 获取歌词的索引和文本
          // 改变歌词滚动页面的位置
          this.setData({
            currentLysic: this.data.lyricInfos[index].text, 
            currentIndex: index,
            lyricScrollTop: 35 * index
          })
        })
        audioContent.onWaiting(() => {
          audioContent.pause()
        })
        audioContent.onCanplay(() => {
          audioContent.play()
        })
        audioContent.onEnded(() => {
          if(audioContent.loop) return
          this.changeNewSong()
        })
        }
  },

  // 轮播图
  onSwiperCahnge(event) {
    this.setData({ currentPage: event.detail.current })
  },
  handleTabClick(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },
  // 用户点击滑块位置
  onSliderChange(event) {
    const value = event.detail.value
    // 计算出要播放的时间
    const currentTime = value / 100 * this.data.durationTime
    // 设置播放器播放时间
    audioContent.seek(currentTime / 1000)
    this.setData({currentTime, isSliderChanging: false})
  },
  // 获取实时滑动的值
  onSliderChanging: throttle(function(event) {
    const value = event.detail.value
    // 根据当前的值计算时间
    let currentTime = value / 100 * this.data.durationTime
    this.setData({currentTime})

    // 不要修改滑块的值
    this.setData({isSliderChanging: true})
  }, 100),
  // 播放暂停歌曲
  PlayOrPause() {
    if(!this.data.play) {
      audioContent.play()
      this.setData({play: true})
    }else {
      audioContent.pause()
      this.setData({play: false})
    }
    
  },
  // 点击上一首歌曲
  onPrevBtnTab() {
    this.changeNewSong(false)
    this.setupPlaySong()
  },
  onNextBtnTab() {
    this.changeNewSong()
    this.setupPlaySong()
  },
  changeNewSong(isNext = true) {
    // 获取之前的数据和索引
    const length = this.data.playSongList.length
    let index = this.data.playSongIndex

    // 根据之前的值计算最新的索引，三种模式
    switch(this.data.playModeIndex) {
      case 1: // 单曲循环
      case 0: // 顺序播放
      index = isNext ? index + 1 : index - 1
      if(isNext && index === length) index = 0
      if(!isNext && index === -1) index = length - 1
      break
      case 2: // 随机播放
      index = Math.floor(Math.random() * length)
      break
    }

    const newSong = this.data.playSongList[index]
    // 保存最新的index
    playStore.setState("playSongIndex", index)
    this.setData({id: newSong.id})
  },
  // store共享数据
  getPlaySongInfosHander({playSongList, playSongIndex}) {
    if(playSongList) {
      this.setData({playSongList: playSongList})
    }
    if(playSongIndex !== undefined) {
      this.setData({playSongIndex: playSongIndex})
    } 
  },
  onUnload() {
    playStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHander)
  },
  // 播放模式
  onModeBtnTap() {
    let modeIndex = this.data.playModeIndex
    modeIndex = modeIndex + 1
    if(modeIndex > 2) modeIndex = 0
    this.setData({playModeIndex: modeIndex})
    if(this.data.playModeIndex === 0) {
      this.setData({modeName: "cycle"})
    }else if(this.data.playModeIndex === 1) {
      this.setData({modeName: "Random"})
    }else {
      this.setData({modeName: "sequence"})
    }
    // 单曲循环
    if(modeIndex === 1) {
      audioContent.loop = true
    }else {
      audioContent.loop = false
    }
  },

})