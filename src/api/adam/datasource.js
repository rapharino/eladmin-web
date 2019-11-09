import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'adam/api/datasource',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'adam/api/datasource/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'adam/api/datasource',
    method: 'put',
    data
  })
}

export function downloadTbDatasource(params) {
  return request({
    url: 'adam/api/datasource/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
