import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import {removeUser} from '../../utils/storageUtils'
import { reqCurrentWeather} from '../../api'
import {formateDate} from '../../utils/timerUtils'
import {LinkButton} from '../../components/link-button'
import { Modal } from 'antd';

import {logout} from '../../pages/redux/actions'
import {connect} from 'react-redux'

import './header.less'
 class Header extends Component {

    state={
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '', 
        weather: ''
    }

    /*
    得到天气数据
    */
    getWeather=async ()=>{
        const {dayPictureUrl,weather} =await reqCurrentWeather('北京')
        this.setState({
            dayPictureUrl,
            weather
        })

    }
    /*
    更新时间
    */
    updataTime=()=>{
    
        //开启循环定时器，每一秒更新状态
        this.timerId=setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({
                currentTime
            })
        },1000)
        
    }

    /*
    退出按钮
    */
   logout=()=> {
    Modal.confirm({
      title: '你确定要退出登录吗?',
    //   content: 'Some descriptions',
      onOk:()=> {
        // //确定退出登录的话，把内存和local中存储的信息删除掉
        // removeUser()
        // memoryUtils.user={}
        // //并且会回到login界面
        // this.props.history.replace('/login')
        this.props.logout()
      },
      onCancel() {
        console.log('取消');
      },
      okText:'确认',
      cancelText:'取消'
    });
  }
    

    /*
    动态显示三角形上面的名字（menuList中的title）
    */
   getTitle=()=>{
        const path=this.props.location.pathname
        let title=''
        menuList.forEach((item)=>{
            if(item.key === path){
                title=item.title
            }else if(item.children){
                const citem=item.children.find((citem)=>path.indexOf(citem.key)===0)
                if (citem){
                    title=citem.title
                }
            }
        })
        return title
   }

 

   componentDidMount(){
    this.getWeather()
    this.updataTime()
   }
   /*
   在挂载完毕的时候关闭定时器
   */
  componentWillUnmount(){
    clearInterval(this.timerId)
}


    render() {
        //得到当前请求对应的标题
        // const title=this.getTitle()
        const title =this.props.HeaderTitle
        /*
        从内存中读取名字user
        */
        // const user=memoryUtils.user
        const user=this.props.user
        // {
        //     console.log(user)
        // }
        const {currentTime,dayPictureUrl,weather}=this.state
        // console.log(this.state)
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，
                        {user.username}
                    </span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        {dayPictureUrl ? <img src={dayPictureUrl} alt="weather"/>:null}
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
// export default withRouter(Header)
/*
包装当前的ui组件为容器组件
    容器组件：向UI组件传入特定的属性
    一般属性：读取redux的状态数据交给UI组件显示
    函数属性：包含dispatch（）更新状态的函数交给UI组件调用  6：8
*/
export default connect(
    //这里的state就是总状态。
    state=>({
        HeaderTitle:state.HeaderTitle,
        user:state.User
    }) ,  //传递一般属性
    {logout}   //传递函数属性
)(withRouter(Header))  //这时Header接收了一个HeaderTitle的属性。