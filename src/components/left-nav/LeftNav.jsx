import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import {Link,withRouter} from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './left-nav.less'
const { SubMenu,Item } = Menu;

 class LeftNav extends Component {

    /* 
    需要动态的显示下拉列表的每一项
    */
    getNavList=(menuList)=>{
        const path=this.props.location.pathname
        return menuList.reduce((pre,item)=>{
        //console.log(item)
        if (!item.children){
            pre.push(
                <Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                </Item>
            )
                
        }else{
            // this.getNavList(item.children)
            //当前item的children中的item的key与当前请求的路径相同，当前item的key就是openKey.
            const cItem=item.children.find((citem)=>citem.key===path)
            if (cItem){
                this.openKey=item.key
            }

            pre.push(
                <SubMenu
                    key={item.key}
                    title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                    }
                >
                    {
                        this.getNavList(item.children)
                    }
                </SubMenu>
                )    
            }
        return pre
        },[])
    }

    componentWillMount() {
        
        this.menuNode=this.getNavList(menuList)
    }

    render() {
        // console.log(this.props)
        // const menuNode=this.openKey //放这里效率很低，列表只需要加载一次就好了
        const path=this.props.location.pathname
        // const menuNode=this.getNavList(menuList)
        // console.log(this.openKey)
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    //获取当前地址栏的内容(使用withRouter，子组件继承父组件的属性)，放入selectedKeys中。
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]} 
                    >
                {
                    this.menuNode //根据数据数组生成标签数组
                    // menuNode
                }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)
