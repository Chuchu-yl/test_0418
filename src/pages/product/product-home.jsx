import React, { Component } from 'react'
import {Card,Form,Icon,Select,Input, Button, Table, message} from 'antd'

import {LinkButton} from '../../components/link-button'
import {reqProductList,reqSearchProductsList,reqProductsUpdata} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import {PAGE_SIZE} from '../../utils/constant'

import throttle from 'lodash.throttle'

import './product-detail.less'
const Option= Select.Option

/*
    每点击一次页码，就发送一次请求
*/

export default class ProductHome extends Component {

    state={
        products:[], //当前product商品的数组
        total:0 ,  //商品总数，需要变化
        loading:false,
        searchType:'productName' , //选择搜索的类型（name  desc）
        searchName:'' //输入框输入的搜索的内容
    }


    initColumns=()=>{
        this.columns=[
            {
                title:'商品名称',
                dataIndex:'name'
            },
            {
                title:'商品描述',
                dataIndex:'desc'
            },
            {
                title:'价格',
                dataIndex: 'price',
                render: price => `¥${price}`
            },
            {
                title:'状态',
                width:100,
                // dataIndex: 'status',
                render:(product)=>{
                        let btnTxt='下架'
                        let text='在售'
                    if(product.status===2){
                        btnTxt='上架'
                        text='已下架'
                    }
                    let productId=product._id 
                    let status=product.status === 1 ? 2 : 1
                    // console.log(product)
                    return(
                        <span>
                            <Button type='primary' 
                            
                            onClick={()=>this.updownGoods(productId,status)}>{btnTxt}</Button>
                            <span>{text}</span>
                        </span>
                    )
                }

            },
            {
                title:'操作',
                width:100,
                render:(product)=>(
                    <span>
                        <LinkButton
                         onClick={
                             ()=>{
                                memoryUtils.product=product
                                this.props.history.push(`/product/detail/${product._id}`)
                                }}
                         >
                             详情
                        </LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdata',product)}>修改</LinkButton>
                    </span>
                )
            }
        ]
    }

/*
上架或下架商品//函数节流
*/


updownGoods=throttle(async (productId,status)=>{
    //点击按钮，更新产品状态，动态修改上架下架按钮
    const result = await reqProductsUpdata(productId,status)
    if(result.status===0){
        message.success('状态更新成功')
       //发送请求完成以后，需要更新商品的显示
       this.getProducts(this.pageNum) 
    }else{
        message.error('状态更新失败')
    }
},2000,{'trailing': false})

    /*
    发送获取商品的请求
    */
    getProducts=async (pageNum)=>{
        this.pageNum=pageNum  //保存当前分页
        this.setState({
            loading:true
        })
        /*
        如果没有值就是一般的分页请求，有值就去发搜索的请求
        */
       let result
       const {searchType,searchName}=this.state
       if(!searchName){
           result = await reqProductList(pageNum,PAGE_SIZE) 
       }else{
           result=await reqSearchProductsList({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
       }
        //pageNum表示当前商品页
        
        this.setState({
            loading:false
        })
        if(result.status===0){
            const total=result.data.total
            const list=result.data.list
            console.log(list)
            this.setState({
                total:total,
                products:list
            })
        }
   }

   /*
   搜素商品
   */
    // searchProducts=async(pageNum)=>{
    //     const {searchType,searchName}=this.state
    //     this.setState({
    //         loading:true
    //     })
    //     //发送请求
    //     const result =await reqSearchProductsList({pageNum,pageSize:2,searchType,searchName})
    //     this.setState({
    //         loading:false
    //     })
    //     if(result.status===0){
    //         //状态为0说明发送请求成功，然后把搜索到的商品显示在下面
    //         const total=result.data.total
    //         const list =result.data.list
    //         this.setState({
    //             total,
    //             products:list
    //         })
    //     }
    // }
    

  
    //初始化数据
    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getProducts(1) //默认加载的时候先挂载第一页,
        // this.searchProducts(1)
    }
    

    render() {
        const {products,total,loading,searchType,searchName} =this.state
        console.log(products,searchName)
        const title=(
            <span>
                <Select value={searchType} style={{ width: 200}} onChange={(value)=>this.setState({searchType:value})}>
                <Option value='productName'>按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input type="text" 
                style={{ width: 200, margin: '0 15px'}} 
                placeholder="关键字" 
                value={searchName}
                onChange={event=>this.setState({searchName:event.target.value})}
                />
                {/* <Button type="primary" onClick={()=>this.searchProducts(1)}>搜索</Button> */}
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type="primary" onClick={()=>this.props.history.push('/product/addupdata')}>
            <Icon type="plus"/>
                添加
            </Button>
        )
        

        return (
            <Card title={title} extra={extra}>
                <Table
                rowKey='_id'
                dataSource={products}
                columns={this.columns}
                bordered
                loading={loading}
                pagination={{
                    //current的出现是为了在第二页搜索的时候，显示第一页
                    current:this.pageNum,   //current表示当前页
                    pageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    total,
                    onChange:this.getProducts
                    }}
                />
         </Card>
        )
    }
}
