/*
封装一下localstorage的设置和读取的方法。（setitem，getitem）
操作local数据的工具模块，保存user到local，从local把user读取出来
*/
/*
使用store来封装一下localstorage实现的功能
*/
import store from 'store'
const USER_KEY = 'user_key'
// export const savaUser =(user)=>{localStorage.setItem('user_key',JSON.stringify(user))}
export const savaUser = (user) => store.set(USER_KEY, user)
/* 
读取得到user
*/
// export const getUser = () => JSON.parse(localStorage.getItem('user_key') || '{}')
export const getUser = () => store.get(USER_KEY) || {}

/* 
删除user
*/
export const removeUser = () => store.remove(USER_KEY)