import request from './request'

export const getRoleList = (params) => request({ url: '/role/list', method: 'get', params })
export const addRole = (data) => request({ url: '/role', method: 'post', data })
export const updateRole = (data) => request({ url: '/role', method: 'put', data })
export const deleteRole = (id) => request({ url: '/role/' + id, method: 'delete' })
export const getRoleMenus = (id) => request({ url: '/role/' + id + '/menus', method: 'get' })
export const assignMenus = (id, data) => request({ url: '/role/' + id + '/menus', method: 'put', data })
export const getMenuList = (params) => request({ url: '/menu/list', method: 'get', params })
