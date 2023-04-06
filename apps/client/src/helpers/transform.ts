import { camelCase, snakeCase } from 'lodash'

/* 
  Credit for solution https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
*/

function isObject(data: any): boolean {
  return data === Object(data) && typeof data !== 'function' && !Array.isArray(data)
}

export function transformResponse(data: any): any {
  if (isObject(data)) {
    const n: { [key: string]: any } = {}
    Object.keys(data).forEach((key) => {
      n[camelCase(key)] = transformResponse(data[key as keyof typeof data])
    })
    return n
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformResponse(item))
  }

  return data
}

export function transformRequest(data: any): any {
  if (isObject(data)) {
    const n: { [key: string]: any } = {}
    Object.keys(data).forEach((key) => {
      n[snakeCase(key)] = transformRequest(data[key as keyof typeof data])
    })
    return n
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformRequest(item))
  }

  return data
}
