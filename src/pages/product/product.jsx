import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductDetail from './product-detail'
import ProductAddUpdata from './product-add-updata'
import ProductHome from './product-home'
/**
 * 商品管理
 */
export default class Product extends Component {
  render() {
    return (
      //商品页面展示的为路由组件
      <Switch>
        <Route exact path='/product' component={ProductHome}/>
        <Route path='/product/detail/:id' component={ProductDetail}/>
        <Route path='/product/addupdata' component={ProductAddUpdata}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
