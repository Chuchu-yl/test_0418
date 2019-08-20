import React, { Component } from 'react'

import { Card,Button,Icon,Table,Modal ,Form, message } from 'antd'

import {reqCategoryList,reqUpdataCategory,reqAddCategory} from '../../api/index'
import CategaruForm from './categaru-form'

import {LinkButton} from '../../components/link-button'
// import LinkButton from 

/**
 * 分类管理
 */
export default class Category extends Component {

  state={
    showStatus:0  ,//0的时候不显示，1的时候添加分类显示，2的时候修改分类显示
    categorys:[],  //初始所有的数据资源为空数组
    loading:false
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
          //在事件的回调函数里想要传参数，外部包裹一个箭头函数。
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
    //异步获取所有列表之前显示loading
    this.setState({
      loading:true
    })
    const result=await reqCategoryList()
    //异步获取所有列表之后隐藏loading
    this.setState({
      loading:false
    })
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

  // const categoryName=category.name
  this.category=category  //保存category，获取当前点击修改数据的名字
  // console.log(category)

  this.setState({
    showStatus:2
  })
}
/* 
添加分类
    父组件想得到子组件的form属性，父组件向父组件传递函数过去
*/
addCategory= ()=>{
//进行表单验证(传参数：子传父，传递form属性)
  this.form.validateFields( async (err,values)=>{
    if(!err){
      /*
      发送完请求之后，对话框消失，input框中的数据清除
      */
     this.setState({
       showStatus:0
     })
       // 重置输入框的值(变为初始值)
       this.form.resetFields()
      //2.收集数据
    //因为是post验证，api接口传入的是值而不是参数，所以需要把值取出来，放入请求数据中
    const category=values.categoryName
    //3.发送请求
    const result = await reqAddCategory(category)
    //4.根据不同的请求结果做处理
    if(result.status===0){
      //发送了请求，添加新的分类到列表中显示出来
      message.success('发送请求成功')
      this.getCategory()  //重新发请求，把最新的列表获取再显示。
    }else{
      message.error('请求发送失败',result.msg)
    }


    }
  })
}
/*
修改分类
  修改当前的名字为我输入的值
*/
updataCategory=()=>{
    //进行表单验证
    this.form.validateFields(async(err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        this.form.resetFields()

        //1.收集数据
        const categoryId=this.category._id
        const categoryName=values.categoryName
        //2.发送请求，修改名字和ID
        const result =await reqUpdataCategory(categoryId,categoryName)
        if(result.status===0){
          message.success('数据修改成功')
          //重新更新数据
          this.getCategory()
        }else{
          message.error('数据修改失败',result.msg)
        }
      }
    
      
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
存入子组件传递的form属性
*/
setForm=(form)=>{
  this.form=form
}

/*
取消按钮，隐藏对话框
*/
handleCancel=()=>{
  //点击取消的时候，需要重置修改的值
  this.form.resetFields()

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
    
    const {showStatus,categorys,loading}=this.state
    const category=this.category || {}  //避免初始render的时候报错
    console.log(category)
    return (
      
        <Card extra={extra}>
          <Table 
          rowKey="_id"
          dataSource={categorys} 
          columns={this.columns}
          bordered
          pagination={{ pageSize: 5, showQuickJumper: true}}
          loading={loading}
          />;
          
        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='确认'
        >
          {/* 这里需要加入form组件 */}
          <CategaruForm setForm={this.setForm}/>
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus===2}
          onOk={this.updataCategory}
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='确认'
        >
          {/* 这里需要加入form组件 */}
          <CategaruForm categoryName={category.name} setForm={this.setForm}/>
        </Modal>

        
        </Card>
      
    )
  }
}

