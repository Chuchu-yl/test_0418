import React from 'react'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect,Switch,Route} from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/LeftNav'
import Header from '../../components/header/Header'

import Category from '../category/category'
import Home from '../home/home'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const {  Footer, Sider, Content } = Layout;
export default class Admin extends React.Component{

        render(){
            const user = memoryUtils.user
            //如果当前用户没有登录，自动跳转到login界面
            if(!user._id){
              return <Redirect to='/login'/>   //在render（）中
            }
            return(
                <Layout style={{height:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>header</Header>
                        <Content style={{ margin:20,background:'white',}}>
                    {/* 这里放入各种路由组件 */}
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/category'/>
                            </Switch>
                        </Content>
                        <Footer style={{color:'#aaaaaa',textAlign:'center'}}>
                            推荐使用谷歌浏览器，可以获得更佳页面操作体验
                        </Footer>
                    </Layout>
                </Layout>
            )
        }
}