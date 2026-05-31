import request from './request'

export const getCustomerList = (params) => request({ url: '/customer/list', method: 'get', params })
export const addCustomer = (data) => request({ url: '/customer/add', method: 'post', data })
export const updateCustomer = (data) => request({ url: '/customer/update', method: 'put', data })
export const deleteCustomer = (id) => request({ url: '/customer/delete/' + id, method: 'delete' })
export const importCustomers = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return request({ url: '/customer/import', method: 'post', data: fd, headers: { 'Content-Type': 'multipart/form-data' } })
}
export const exportCustomers = () => request({ url: '/customer/export', method: 'get', responseType: 'blob' })
