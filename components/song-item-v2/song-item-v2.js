// components/song-item-v2/song-item-v2.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: ""
    }
  },
  methods: {
    handlePlayList(options) {
      const id = options.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../pages/music-player/music-player?id=${id}`,
      })
    }
  }
})
