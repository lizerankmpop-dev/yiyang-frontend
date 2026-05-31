import request from './request'

export const applyCheckout = (data) => request({ url: '/backdown/apply', method: 'post', data })
export const getCheckoutList = (params) => request({ url: '/backdown/list', method: 'get', params })
