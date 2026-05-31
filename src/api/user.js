import request from './request'

export const userLogin = (data) => request({ url: '/user/login', method: 'post', data })
export const userRegister = (data) => request({ url: '/user/register', method: 'post', data })
export const getUserList = (params) => request({ url: '/user/list', method: 'get', params })
export const updateUser = (data) => request({ url: '/user/update', method: 'post', data })
export const deleteUser = (id) => request({ url: '/user/delete', method: 'delete', params: { id } })