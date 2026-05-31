import request from './request'

// 获取床位列表
export function getBedList(params) {
  return request({
    url: '/bed/list',
    method: 'get',
    params
  })
}

// 获取空闲床位列表（供客户新增/编辑时选择）
export function getAvailableBeds(params) {
  return request({
    url: '/bed/available',
    method: 'get',
    params
  })
}

// 新增床位
export function addBed(data) {
  return request({
    url: '/bed/add',
    method: 'post',
    data
  })
}

// 修改床位
export function updateBed(data) {
  return request({
    url: '/bed/update',
    method: 'post',
    data
  })
}

// 删除床位
export function deleteBed(id) {
  return request({
    url: '/bed/delete',
    method: 'delete',
    params: { id }
  })
}