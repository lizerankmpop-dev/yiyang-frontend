import request from './request'

export const checkIn = (data) => request({ url: '/checkin', method: 'post', data })
export const getAvailableBeds = (params) => request({ url: '/checkin/available-beds', method: 'get', params })
