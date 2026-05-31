import request from './request'

export function getDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

export function getNursingLevelDistribution() {
  return request({
    url: '/dashboard/nursing-level-distribution',
    method: 'get'
  })
}

export function getAgeDistribution() {
  return request({
    url: '/dashboard/age-distribution',
    method: 'get'
  })
}
