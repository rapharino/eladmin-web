import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'adam/api/template',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'adam/api/template/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'adam/api/template',
    method: 'put',
    data
  })
}

export function downloadTbProject(params) {
  return request({
    url: 'adam/api/template/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}


export function listFile(params) {
  return request({
    url: 'adam/api/template/file',
    method: 'get',
    params
  })
}

export function delFile(params) {
  return request({
    url: 'adam/api/template/file',
    method: 'delete',
    params
  })
}
