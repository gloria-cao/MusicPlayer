// components/ranking-item/ranking-item.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    // 区分不同榜单
    key: {
      type: String,
      value: "newRanking"
    }
  },
  methods: {
    handleRanking() {
      // 把数据传给detil-song页面，然后进行跳转
      const type = "ranking"
      const key = this.properties.key
      wx.navigateTo({
        url: `../detail-song/detail-song?type=${type}&key=${key}`,
      })
    }
  }
})
