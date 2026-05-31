import request from './request'

export const getOutwardList = (params) => request({ url: '/outward/list', method: 'get', params })
export const applyOutward = (data) => request({ url: '/outward/apply', method: 'post', data })
export const auditOutward = (id, data) => request({ url: '/outward/audit/' + id, method: 'put', data })
export const returnOutward = (id, data) => request({ url: '/outward/return/' + id, method: 'put', data })
