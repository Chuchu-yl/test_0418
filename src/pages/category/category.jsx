import React, { Component } from 'react'

import { Card,Button,Icon,Table,Modal ,Form, message } from 'antd'

import {reqCategoryList} from '../../api/index'
import CategaruForm from './categaru-form'

import {LinkButton} from '../../components/link-button'
// import LinkButton from 

/**
 * 分类管理
 */
export default class Category extends Component {

  state={
    showStatus:0  ,//0的时候不显示，1的时候添加分类显示，2的时候修改分类显示
    categorys:[]
  }


/*
设置初始的数据,初始化所有的列表数据
*/
  initColumns=()=>{
    this.columns=[
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        width: 300,
        title: '操作',
         // 渲染当前行时会自动传入当前行对应的数据对象
        render:(category)=>(
            <LinkButton onClick={()=>this.showUpdata(category)}>
                修改分类
            </LinkButton>
        )
      }
    ];
  }
  /*
  异步获取所有分类列表的显示
  */
  getCategory= async()=>{
    
    const result=await reqCategoryList()
    if(result.status===0){
      this.setState({
      categorys:result.data
    })
    }else{
      message.error('数据请求出错')
    }
    
  }
/*
点击显示修改de对话框
*/
showUpdata=(category)=>{

  const categoryName=category.name
  console.log(categoryName)

  this.setState({
    showStatus:2
  })
}



/*
显示确认对话框
*/
showAdd=()=>{

  this.setState({
    showStatus:1
  })
}

/*
确认与取消按钮
*/
handleOk=()=>{
  this.setState({
    showStatus:0
  })
}
handleCancel=()=>{
  this.setState({
    showStatus:0
  })
}

componentWillMount(){
  this.initColumns()
}

componentDidMount(){
  this.getCategory()
}


  render() {
    const extra=(
    <Button type="primary" onClick={this.showAdd}>
      <Icon type="plus"/>
        添加
    </Button>)
    const {showStatus,categorys}=this.state
    
    return (
      <div>
        <Card extra={extra}>
          <Table 
          rowKey="_id"
          dataSource={categorys} 
          columns={this.columns}
          bordered
          pagination={{ pageSize: 5, showQuickJumper: true}}
          />;
          
        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='确认'
        >
          {/* 这里需要加入form组件 */}
          <CategaruForm/>
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus===2}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='确认'
        >
          {/* 这里需要加入form组件 */}
          <CategaruForm/>
        </Modal>

        
        </Card>
      </div>
    )
  }
}
