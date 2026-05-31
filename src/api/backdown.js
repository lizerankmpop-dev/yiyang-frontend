import request from './request'

export const getBackdownList = (params) => request({ url: '/backdown/list', method: 'get', params })
export const applyBackdown = (data) => request({ url: '/backdown/apply', method: 'post', data })
export const auditBackdown = (id, data) => request({ url: '/backdown/audit/' + id, method: 'put', data })
