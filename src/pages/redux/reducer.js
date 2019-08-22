/*
函数模块，根据一个老的state和指定的action计算处理后返回新的state函数模块
    管理头部，管理登录用户
*/
import {combineReducers} from 'redux'
import {getUser} from '../../utils/storageUtils'
import {SET_HEADER_TITLE,RECEIVE_USER,RESULT_MSG,RESET_USER} from './action-types'
/*
管理头部标题的reducer函数
*/
const initHeaderTitle='首页'
function HeaderTitle(state=initHeaderTitle,action){
    switch(action.type){
        case SET_HEADER_TITLE:
            return action.headerTitle
        default:
            return state
    }
}

/*
管理用户user的reducer函数
    (登录，header，admin,role,leftnav.login)
 */

const initUser=getUser()   //从localstorage中读取user作为初始值。是对象
 function User(state=initUser,action){
    switch(action.type){
        case RECEIVE_USER:
            return action.data
        case RESULT_MSG:
            //在reducer中不要直接修改状态数据，而是需要返回新的状态数据
            return {...state,msg:action.data}  //这样就是在state中塞入了一个新的属性，其返回的值还是对象，一旦user对象中有msg就说明登录失败了，保证了之前的数据不丢
        case RESET_USER:
            return {msg:'请重新登录~'}
        default:
            return state;
    }
 }

 export default combineReducers({HeaderTitle,User})   //向外暴露多个reducer函数,状态中就会有这两个属性

 /*
 combineReducers 返回的是整合了多个reducer的总reducer
 */