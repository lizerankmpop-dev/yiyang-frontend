import request from './request'

export const login = (data) => request({
  url: '/admin/login',
  method: 'post',
  data
})

export const register = (data) => request({
  url: '/admin/register',
  method: 'post',
  data
})

export const getAdminList = (params) => request({
  url: '/admin/list',
  method: 'get',
  params
})

export const toggleStatus = (id) => request({
  url: '/admin/toggle-status/' + id,
  method: 'put'
})

export const resetPassword = (id, newPassword) => request({
  url: '/admin/reset-password/' + id,
  method: 'put',
  params: { newPassword }
})
