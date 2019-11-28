import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'adam/api/project',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'adam/api/project/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'adam/api/project',
    method: 'put',
    data
  })
}

export function downloadTbProject(params) {
  return request({
    url: 'adam/api/project/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
