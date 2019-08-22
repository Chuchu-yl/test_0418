/*
包含了多个action的创造者（工厂函数，返回action的函数） actionCreator
    同步action：是一个对象，{type：xxx，data：数据}
    异步action：是一个函数，接收dispatch函数为参数的函数，dispatch=>{1.发异步ajax请求； 2.根据结果分发同步action}
*/
import {SET_HEADER_TITLE,RECEIVE_USER,RESULT_MSG,RESET_USER} from './action-types'
import {reqLogin} from '../../api'
import {savaUser,removeUser} from '../../utils/storageUtils'

                            //原本之前第二个属性写的为data，现在使用了参数名称更见名知意
export const setHeaderTitle = (headerTitle)=>({type:SET_HEADER_TITLE,headerTitle})

/*
接收登录成功的user
*/
export const recevieUser=(user)=>({type:RECEIVE_USER,data:user})
/*
接收登录失败发送的消息
*/
export const showMsg=(msg)=>({type:RESULT_MSG,data:msg})

/*
登录的异步action，需要发请求
*/
export function login(username,password){
    return async dispatch=>{
        //1.发送异步ajax请求
        const result=await reqLogin({username,password})
        if(result.status===0){ //成功
            const user=result.data
            //将user保存的local中
            savaUser(user)
            //分发action，触发reducer调用，产生新的state(将user保存到状态中)
            dispatch(recevieUser(user))
        }else{   //失败
            const msg= result.msg
            dispatch(showMsg(msg))
        }
    }
}

/*
退出同步登陆的action
*/
export const logout=()=>{
    //清除内存中的user
    removeUser()
    //清除状态中的user
    return{
        type:RESET_USER
    }
}