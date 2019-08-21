import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Provider} from 'react-redux'

import store from '../src/pages/redux/store'
//让这个模块一上来就得到执行的机会
import './utils/memoryUtils'


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
,document.getElementById('root'))
