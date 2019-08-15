/*
封装ajax请求：
用来发送ajax请求的函数模块
    请求拦截器：用来把post请求的data对象数据转换为urlencoded字符串（相当于get的地址栏传参）
    响应拦截器：1）.使用成功的回调，直接得到response.data中的数据
               2）.使用失败的回调，统一处理请求异常，外部调用者不用再处理异常
*/
import axios from 'axios'
import qs from 'qs'
import { message } from 'antd';

/*
    1.请求拦截器
*/
axios.interceptors.request.use((config)=>{

    //判断请求的URL是否是post，传递的参数是否是对象
    //判断是为了把对象转换为urlencoded格式
    if(config.method.toUpperCase()==='POST' && config.data instanceof Object){
         config.data= qs.stringify(config.data)
    }
    console.log(config)
    return config
})

/*
    2.响应拦截器
*/
axios.interceptors.response.use(
    //response就是响应的数据
    (response)=>{
        console.log(response)
        return response.data
    },
    (error)=>{
        message.error('请求失败',error.message)
        return new Promise(()=>{})
    }
)




export default axios