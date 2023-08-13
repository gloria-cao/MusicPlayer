// 封装成类
const baseURL = ''
class CQRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(option) {
    return this.request({ ...option, method: "get" })
  }
  post(option) {
    return this.request({ ...option, method: "post" })
  }
}

// 导出类的实例
export const cqReqInstance = new CQRequest("http://codercba.com:9002")
// export const cqLoginReqInstance = new CQRequest("http://123.207.32.32:3000")