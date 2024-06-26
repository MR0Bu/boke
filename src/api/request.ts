// 创建新的 axios 对象
import { message } from "ant-design-vue"
import axios from "axios"
//  import { message } from 'ant-design-vue'
//  import { serverToken } from '../router/a6router'
const _axios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000
})

// 请求拦截器
_axios.interceptors.request.use(
  (config)=>{ // 统一添加请求头
    const token=sessionStorage.getItem('data')
    if(token) {
      token?config.headers.Authorization=token:null;
    }
    
    return config
  },
  (error)=>{ // 请求出错时的处理
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  (response)=>{return response
},
(error)=>{
  if(error.response.status ===0){
    message.error("用户名或密码错误",2)
    return Promise.resolve({})
  }
return Promise.reject(error)
}
)

// 响应拦截器
// _axios.interceptors.response.use(
//   (response)=>{ // 状态码  2xx
//     if(response.data.message) {
//       message.success(response.data.message, 3)
//     }
//     // 这里的code是自定义的错误码
//     if(response.data.code === 0) {
//       return response
//     }
//     else if(response.data.code === 401) {       
//       // 情况1
//       return response
//     }
//     ... 
//   },
//   (error)=>{ // 状态码 > 2xx, 400,401,403,404,500
//     console.error(error) // 处理了异常
//     // 如果是 cors 跨域异常, response.status 是 0
//     if(error.message) {
//       message.success(error.message, 3)
//     }
//     if(error.response.status === 0) {
//       // 情况1
//     } else if(error.response.status === 401) {
//       // 情况2
//     } 
//     // ...
//     return Promise.resolve({ data: { data: {} } })
//   }
// )

export default _axios