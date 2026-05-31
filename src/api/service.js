import request from './request'

export const getCustomerNurseItemList = (params) => request({ url: '/customer-nurse-item/list', method: 'get', params })
export const buyNurseItem = (data) => request({ url: '/customer-nurse-item/buy', method: 'post', data })
export const renewNurseItem = (id, data) => request({ url: '/customer-nurse-item/renew/' + id, method: 'put', data })
export const removeNurseItem = (id) => request({ url: '/customer-nurse-item/' + id, method: 'delete' })
