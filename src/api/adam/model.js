import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'adam/api/model',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'adam/api/model/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'adam/api/model',
    method: 'put',
    data
  })
}

export function downloadTbModel(params) {
  return request({
    url: 'api/tbModel/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
