// components/hotlist-item/hotlist-iten.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  data: {
    itemId: 0
  },
  lifetimes: {
    // 别的生命周期会拿到值，但值不改变
    ready: function() {
      this.setData({ itemWidth: app.globalData.screenWidth })
    }
  },
  methods: {
    handlePlayList(options) {
      this.setData({itemId: options.currentTarget.dataset.id})
      wx.navigateTo({
        url: `../../pages/detail-song/detail-song?type=menu&id=${this.data.itemId}`,
      })
    }
  }
})
