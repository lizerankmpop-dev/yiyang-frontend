import request from './request'

export const getOverview = () => request({ url: '/statistics/overview', method: 'get' })
export const getBedStats = () => request({ url: '/statistics/bed', method: 'get' })
export const getAgeDistribution = () => request({ url: '/statistics/age-distribution', method: 'get' })
export const getGenderDistribution = () => request({ url: '/statistics/gender-distribution', method: 'get' })
export const getCheckInTrend = () => request({ url: '/statistics/check-in-trend', method: 'get' })
export const getCheckOutTrend = () => request({ url: '/statistics/check-out-trend', method: 'get' })
export const getNurseWorkload = () => request({ url: '/statistics/nurse-workload', method: 'get' })
