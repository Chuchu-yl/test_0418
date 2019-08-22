import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import {setHeaderTitle} from '../../pages/redux/actions'  //这是返回action对象的工厂函数

import './left-nav.less'
const { SubMenu,Item } = Menu;

 class LeftNav extends Component {




    /*
    进行权限的设置
    */
   hasAuth=(item)=>{
        // const user=memoryUtils.user
        const user=this.props.user
        const menus=user.role.menus
        /*
        1.admin 
        2. item是一个公开的(首页)
        3. item的key在当前用户对应的menus中
        */
       if(user.username==='admin' || item.ispublic || menus.indexOf(item.key)!== -1){
           return true
       }else if(item.children){
            // 4. 某个子item的key在menus中
            const key =item.children.find(citem=>menus.indexOf(citem.key)!==-1)
            return !!key
       }
       return false
   }


    /* 
    需要动态的显示下拉列表的每一项
    */
    getNavList=(menuList)=>{
        const path=this.props.location.pathname
        return menuList.reduce((pre,item)=>{
        //console.log(item)
/*
设置权限
*/
        if(this.hasAuth(item)){   //item对应的界面有可能有也有可能没有
            //如果请求的路径与当前item的key一致，就把当前的item的title更新到redux的状态中
            if(path.indexOf(item.key)===0){
                this.props.setHeaderTitle(item.title)   //刷新的时候更新
            }
            if (!item.children){
                pre.push(
                    <Item key={item.key}>
                        <Link to={item.key}  onClick={()=>this.props.setHeaderTitle(item.title)}>   {/*点击的时候更新*/}
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Item>
                )
                    
            }else{
                // this.getNavList(item.children)
                //当前item的children中的item的key与当前请求的路径相同，当前item的key就是openKey.
                const cItem=item.children.find((citem)=>path.indexOf(citem.key)===0)  //与后面的商品列表显示不友好
                // const cItem=item.children.find((citem)=>path.indexOf('/product/')===citem.key)
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
        let path=this.props.location.pathname
        if(path.indexOf('/product/')===0){
            path='/product'
        }
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
// export default withRouter(LeftNav)
export default connect(
    state=>({user:state.User}),
    {setHeaderTitle}    //需要指定状态就需要传入工厂函数
)(withRouter(LeftNav))

/*
给LeftNav传入的是一个重新定义的函数，里面有dispatch，dispatch中需要传入一个action函数对象，并执行
function (...args){   //形参...args表示在打包（把多个数据搞到一个容器中）
    dispatch(setHeaderTitle(...args))   //这里对args进行拆包
}
*/
