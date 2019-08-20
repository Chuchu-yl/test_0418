import React, { Component } from 'react'
import { Card,Icon, Table, message,Button,Modal,Input, Form} from 'antd'
import {PAGE_SIZE} from '../../utils/constant'
import {LinkButton} from '../../components/link-button'
import {reqUserList,reqAddUpdateUsers,reqDeleteUser} from '../../api'
import {formateDate} from '../../utils/timerUtils'
import UserForm from './add-user-form'
/**
 * 用户管理
 */
export default class User extends Component {

  state={
    userList:[] , //所有用户的列表
    roles:[] , //所有角色的列表
    isShowAdd:false,
    
  }

  /*
  设置列表
  */
 initColums=()=>{
   this.columns=[
     {
       title:'用户名',
       dataIndex:'username'
     },{
       title:'邮箱',
       dataIndex:'email'
     },
     {
       title:'电话',
       dataIndex:'phone'
     },
     {
       title:'注册时间',
       dataIndex:'create_time',
       render:formateDate
     },
     {
       title:'所属角色',
       dataIndex:'role_id',
        // render:(role_id)=>this.state.roles.find( (role) => role._id===role_id).name  //每次渲染都需要遍历，不好
        render:(role_id)=>this.roleObj[role_id]  //把所有的角色存为一个对象，用的时候取
     },
     {
       title:'操作',
       render:(user)=>{
          return (
            <div>
              <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
            </div>
          )
       }
       
     }
   ]
 }

/*
获取角色信息
*/
getRoles=(roles)=>{
    this.roleObj=roles.reduce((pre,role)=>{
      pre[role._id]=role.name
      return pre
    },{})
}

/*
修改用户界面
*/
showUpdate=(user)=>{
  this.user=user
  console.log(user)
  this.setState({
    isShowAdd:true
  })
}

/*
添加用户界面
*/
showAdd=()=>{
  this.user=null
  this.setState({
    isShowAdd:true
  })
}



/*
获取所有用户信息
*/
getUser=async ()=>{

  const result=await reqUserList()
  if(result.status===0){
    const roles=result.data.roles
    // console.log(roles)
    this.getRoles(roles)
    // console.log(result)
    this.setState({
      userList:result.data.users,
      roles
    })
    console.log(result.data.users)
  }
}



/*
点击确认，添加用户或者更新用户
*/
AddUpdateUsers=async ()=>{
  //需要进行判断，如果用户_id存在的话，就不能进行添加的操作,就应该是更新的操作
  //1.获取正在输入的内容
  const user=this.form.getFieldsValue()
  //  console.log(content)
  if(this.user){ //如果this.user存在的话就是更新的，
    user._id=this.user._id 
    
  }
  this.setState({
    isShowAdd:false
  })
  //2.发送请求
  const result = await reqAddUpdateUsers(user)
  if(result.status===0){
    //message.success(`${result._id?}用户成功`)
    // console.log(result)
    message.success(`${this.user?'更新':'添加'}用户成功`)
    this.getUser()
  }else {
    message.error(result.msg)
  }

}
/*
删除用户
*/
deleteUser=(user)=>{
  Modal.confirm(
    {
      content:(`你确定要删除${user.username}用户吗？`),
      okText: '确定',
      cancelText: '取消',
      onOk:async()=>{
        const result=await reqDeleteUser(user._id)
        if(result.status===0){
          message.success('用户删除成功')
          this.getUser()
        }
      }
    }
  )
  
}


  componentWillMount() {
    this.initColums()
    
  }
  componentDidMount() {
    this.getUser()
  }
  
  

  render() {
    const title=(
      <Button 
      type='primary' 
      onClick={()=>{
        this.showAdd()
        }}>
        创建用户
      </Button>
    )
    const {userList,isShowAdd,roles} =this.state
    const user=this.user || {}
    return (
      <Card title={title}>
        <Table
        rowKey="_id"
        dataSource={userList} 
        columns={this.columns}
        bordered
        pagination={{
          pageSize: PAGE_SIZE,
        }}
        />
        <Modal
        visible={isShowAdd}
        okText='确认'
        cancelText='取消'
        onOk={this.AddUpdateUsers}
        onCancel={()=>{
          this.setState({isShowAdd:false})}
        }
        title={userList._id? '修改用户' : '添加用户'}
        >
          <UserForm 
          setForm={(form)=>this.form=form}
          user={user}
          
           />
        </Modal>


      </Card>
    )
  }
}
