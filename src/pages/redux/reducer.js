/*
函数模块，根据一个老的state和指定的action计算处理后返回新的state函数模块
    管理头部，管理登录用户
*/
import {combineReducers} from 'redux'
import {getUser} from '../../utils/storageUtils'
/*
管理头部标题的reducer函数
*/
const initHeaderTitle='首页'
function setHeaderTitle(state=initHeaderTitle,action){
    switch(action.type){
        default:
            return state
    }
}

/*
管理登录用户的reducer函数
 */

const initUser=getUser()   //从localstorage中读取user作为初始值。
 function User(state=initUser,action){
    switch(action.type){
        default:
            return state;
    }
 }

 export default combineReducers({setHeaderTitle,User})   //向外暴露多个reducer函数

 /*
 combineReducers 返回的是整合了多个reducer的总reducer
 */