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
    return  ajax.post(BASE+'/login',{username,password})
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

/*
5.添加分类
*/
export const reqAddCategory=(categoryName)=>ajax.post('/manage/category/add',{categoryName})

/*
6.更新分类
*/
export const reqUpdataCategory=(categoryId,categoryName)=>ajax({
    url:"manage/category/update",
    method:'POST',
    data:{
        categoryId,
        categoryName
    }
})

/*
7.获取商品分页列表
*/
export const reqProductList=(pageNum,pageSize)=>ajax({
    url:'/manage/product/list',
    params:{
        pageNum, //当前页
        pageSize //每一页有多少个商品
    }
})   

/*
8.根据Name/desc搜索产品分页列表
*/
export const reqSearchProductsList=({pageNum,pageSize,searchType,searchName})=>ajax({
    url:'/manage/product/search',
    params:{
        pageNum,
        pageSize,
        [searchType]:searchName,  //因为searchType为一个变量，所以需要使用括号括起来。
    }
})

/*
9.对商品进行上架/下架处理
*/
export const reqProductsUpdata=(productId,status)=>ajax({
    url:'/manage/product/updateStatus',
    method:'POST',
    data:{
        productId ,
        status 
    }
})

/*
10.添加商品
*/
export const reqAddProducts=({categoryId,name,desc,price,detail,imgs})=>ajax({
    method:'POST',
    url:'/manage/product/add',
    data:{
        categoryId ,
        name ,
        desc,
        price,
        detail,
        imgs
    }
})
/*
11.根据商品ID获取商品
*/
export const reqProductById=(productId)=>ajax({
    url:'/manage/product/info',
    params:{
        productId
    }
})

/*
12.根据分类ID获取分类
*/
export const reqCategoryById=(categoryId)=>ajax({
    url:'/manage/category/info',
    params:{
        categoryId
    }
})

/*
13.删除图片
*/
export const reqDeletePicture=(name)=>ajax.post('/manage/img/delete',{name})

/*
14.添加和更新商品的接口
*/
export const reqAddUpdateProduct=(product)=>ajax.post(`/manage/product/`+(product._id?'update' : 'add'),product)

/*
15.获取角色列表
*/
export const reqRoleList=()=>ajax.get('/manage/role/list')

/*
16.添加角色
*/
export const reqAddRoles=(roleName)=>ajax.post('/manage/role/add',{roleName})

/*
17.更新角色(给角色设置权限)
*/
export const reqAuth=(role) => ajax.post( '/manage/role/update', role)

/*
18.获取所有用户列表
*/
export const reqUserList=()=>ajax('/manage/user/list')

/*
19.添加用户/更新用户
 {
	  "status": 0,
	  "data": {
	    "users": [
	      {
	        "_id": "5cb05b4db6ed8c44f42c9af2",
	        "username": "test",
	        "password": "202cb962ac59075b964b07152d234b70",
	        "phone": "123412342134",
	        "email": "sd",
	        "role_id": "5ca9eab0b49ef916541160d4",
	        "create_time": 1555061581734,
	        "__v": 0
	      }
*/
export const reqAddUpdateUsers=(user)=>ajax.post('/manage/user/'+(user._id?'update':'add'),user)

/*
20.删除用户
*/
export const reqDeleteUser=(userId)=>ajax.post('/manage/user/delete',{userId})
