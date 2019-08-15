/*
利用ajax请求数据：
包含n个接口请求函数的模块, 每个函数的返回值都是promise对象
根据接口文档编写
*/
import ajax from './ajax'
import  jsonp  from 'jsonp'
import {message} from 'antd'

const BASE=''
/*
    1.登录请求
        暴露函数
*/
export const reqLogin=({username,password})=>{
    return  ajax.post(BASE+'/login',{username:'admin',password:'admin'})
}

/*
    2.添加请求
*/
export const reqAddUser=(user)=>ajax({
    url:BASE+'/manage/user/add',
    method:'POST',
    data:user
    //这里的user是对象{}
})

/**
 * 3.获取天气请求
 *          jsonp请求,不能返回promise对象
 */
export const reqCurrentWeather=(city)=>{
//         const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
//         return new Promise((resolve,reject)=>{
//           jsonp(url,{},(err,data)=>{
//             if(!err && data.err===0){
//                 const {dayPictureUrl,weather} = data.results[0].weather_data[0]
//                 resolve({dayPictureUrl,weather})
//             }else{
//                 message.error('获取天气数据失败！')
//             }
//           })  
//         })
// }
const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  
    return new Promise((resolve, reject) => { // 执行器函数
        jsonp(url, {}, (err, data) => {
            if (!err && data.error === 0) {
            const {dayPictureUrl, weather} = data.results[0].weather_data[0]
            resolve({dayPictureUrl, weather})
            } else {
            // reject(err)
            message.error('获取天气信息失败!')
            }
        })
    })

}

/*
4.获取分类列表
*/
export const reqCategoryList=()=>ajax('/manage/category/list')

    
