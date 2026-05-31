import request from './request'

export const getScheduleList = (params) => request({ url: '/schedule/list', method: 'get', params })
export const addSchedule = (data) => request({ url: '/schedule', method: 'post', data })
export const updateSchedule = (data) => request({ url: '/schedule', method: 'put', data })
export const deleteSchedule = (id) => request({ url: '/schedule/' + id, method: 'delete' })
