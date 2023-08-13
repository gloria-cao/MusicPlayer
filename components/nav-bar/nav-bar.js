// components/nav-bar/nav-bar.js
const app = getApp()
Component({
  // 多插槽需要设置这个
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: Object,
      value: "导航标题"
    }
  },
  data: {
    statusHeight: 20
  },
  lifetimes: {
    attached() {
      this.setData({ statusHeight: app.globalData.statusHeight })
    }
  },
  methods: {
    onLeftClick() {
      this.triggerEvent("leftClick")
    }
  }
})
