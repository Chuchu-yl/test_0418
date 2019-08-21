import {createStore,applyMiddleware} from 'redux'
import { composeWithDevTools} from 'redux-devtools-extension'  //开发的调试插件
import thunk from 'redux-thunk'  //异步中间件，需要一个applyMiddleware中间件
import Reducer from './reducer'

//默认向外暴露一个store对象
export default createStore(Reducer,composeWithDevTools(applyMiddleware(thunk)))