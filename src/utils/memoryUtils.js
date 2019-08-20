
// const user=JSON.parse(localStorage.getItem('user_key') ||"{}")
import {getUser} from './storageUtils'
const user=getUser()
//在这里就是缓存了一下user，只读取一次
export default {
    //从local中读取user，保存在内存中(user就是data数组)
    user,
    product:{}
}