import { cqReqInstance } from "./index"

export function getTopMvList(offset = 0, limit = 20) {
  return cqReqInstance.get({
    url: "/top/mv",
    data: {
      offset,
      limit
    },
  })
}

// 获取mv视频数据 
export function getMvDetail(id) {
  return cqReqInstance.get({
    url: '/mv/url',
    data: {
      id
    }
  })
}

// 获取mv详情数据
export function getMvDetailInfo(mvid) {
  return cqReqInstance.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}

// 相关视频
export function getRelativeMvUrl(id) {
  return cqReqInstance.get({
    url: '/related/allvideo',
    data: {
      id
    }
  })
}