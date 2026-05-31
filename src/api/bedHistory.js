import request from './request'

export const getBedHistoryList = (params) => request({ url: '/bed-history/list', method: 'get', params })
export const updateEndTime = (id, data) => request({ url: '/bed-history/' + id + '/end-time', method: 'put', data })
export const getCustomerBedHistory = (customerId) => request({ url: '/bed-history/customer/' + customerId, method: 'get' })
export const changeBed = (data) => request({ url: '/change-bed', method: 'post', data })
export const getAvailableBedsForChange = (params) => request({ url: '/change-bed/available-beds', method: 'get', params })
