import request from './request'

export const getHealthRecordList = (params) => request({ url: '/health-record/list', method: 'get', params })
export const addHealthRecord = (data) => request({ url: '/health-record/add', method: 'post', data })
export const getHealthRecordById = (id) => request({ url: '/health-record/' + id, method: 'get' })
export const updateHealthRecord = (data) => request({ url: '/health-record', method: 'put', data })
export const deleteHealthRecord = (id) => request({ url: '/health-record/' + id, method: 'delete' })
