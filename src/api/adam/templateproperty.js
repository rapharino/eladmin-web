import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'adam/api/templateproperty',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'adam/api/templateproperty/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'adam/api/templateproperty',
    method: 'put',
    data
  })
}

export function downloadTbProject(params) {
  return request({
    url: 'adam/api/templateproperty/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
