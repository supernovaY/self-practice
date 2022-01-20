import axios from './request/axios.js'
import gmop from './request/mgop.js'

function service (opt) {
  if (process.env.NODE_ENV === 'servertest' || process.env.NODE_ENV === 'development') {
    return axios(opt)
  }

  return gmop(opt)
}

export default service
