import React, { Component } from 'react'
import { Card,Icon, Table, message,Button,Modal,Input, Form} from 'antd'
import {LinkButton} from '../../components/link-button'
import {reqRoleList,reqAddRoles,reqAuth} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constant'
import {formateDate} from '../../utils/timerUtils'
import AddForm from './add-form'
import AuthTree from './auth-tree'
// import memoryUtils from '../../utils/memoryUtils'
import {connect} from 'react-redux'
/**
 * 角色管理
 */
 class Role extends Component { 
  state={
    roleList:[],
    showAdd:false,
    showAuth:false
  }

  Menus=React.createRef()

  initColunms=()=>{
    this.columns=[
      {
        title:'角色名称',
        dataIndex:'name',
        render:(name)=>name
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time)=>formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:(auth_time)=>formateDate(auth_time)
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
        render:(auth_name)=>auth_name
      },{
        title:'操作',
        render:(auth)=>(
          <LinkButton onClick={()=>{
            this.getAuth(auth)
          }}>设置权限</LinkButton>
        )
      }
    ]
  }

/*
拿到当前角色名称的权限信息
*/
getAuth= (role)=>{
  this.role=role  //保存权限的信息，需要传给authtree来展示
  console.log(role)
  this.setState({showAuth:true})

}
 /*
 更新角色
 */
updateRole=async ()=>{
  const role=this.role
  console.log(role)
    role.menus = this.Menus.current.getMenus()
    role.auth_time = Date.now()
    //读取授权人名字
    // role.auth_name = memoryUtils.user.username
    role.auth_name=this.props.user.username
    const result =await reqAuth(role)
    if(result.status===0){

      message.success('设置权限成功')
      this.getroleList()
      this.setState({
        showAuth:false
      })
    }
}
  getroleList=async ()=>{

    const result=await reqRoleList()
    if(result.status===0){
      // message.success('获取角色信息成功')
      console.log(result)
      this.setState({
        roleList:result.data
      })
    }
  }
  /*
  创建角色
  */
 CreateRoles=()=>{
  // console.log(this.form)
  //创建角色的时候进行校验
  this.form.validateFields(async (error,values)=>{
    if(!error){

      const roleName =values.roleName
      // console.log(values)
      // console.log(roleName)

      const result=await reqAddRoles(roleName)
      console.log(result)
      if(result.status===0){
        message.success('添加角色成功')
        this.getroleList()
      }else{
        message.error('添加角色失败')
      }

    }
  })
 }



 

componentWillMount() {
  this.initColunms()
}
componentDidMount() {
  this.getroleList()
}



  render() {
    
    const {roleList,showAdd,showAuth} = this.state
    const title=(
      <Button type='primary' onClick={()=>{this.setState({showAdd:true})}}>
        创建角色
      </Button>
  )
  
  
    return (
      <Card title={title}>
        <Table
        rowKey="_id"
        dataSource={roleList} 
        columns={this.columns}
        bordered
        pagination={{
          pageSize: PAGE_SIZE,
        }}
        />
        <Modal
        onOk={this.CreateRoles}
        onCancel={()=>{
          this.form.resetFields()
          this.setState({showAdd:false})}
        }
        okText='确认'
        cancelText='取消'
        visible={showAdd}
        title='添加角色'
        >
          <AddForm setForm={(form) => this.form = form}/>
        </Modal>

        <Modal
        onOk={this.updateRole}
        onCancel={()=>{
          // this.form.resetFields()
          this.setState({showAuth:false})}
        }
        okText='确认'
        cancelText='取消'
        visible={showAuth}
        title='设置权限'
        >
         <AuthTree role={this.role} ref={this.Menus}/>
        </Modal>

      </Card>
    )
  }
}

export default connect(
  state=>({user:state.User}),
  {}
)(Role)
