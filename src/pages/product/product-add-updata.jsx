import React, { Component } from 'react'
import {Card,Form,Input,Icon,Button,Select,message} from 'antd'

import {LinkButton} from '../../components/link-button'
import {reqCategoryList,reqAddUpdateProduct} from '../../api'
import PicturesWall from './pictures-walls'
import RichTextEditor from './rich-text-editor'

const Item=Form.Item
const Option = Select.Option

class ProductAddUpdata extends Component {

    state={
        categorys:[]  //下拉框的列表数组
    }

    findComponent=React.createRef()
    getText=React.createRef()
    LimitNumber=(rule, value, callback)=>{
        if(value<0){
            callback('价格必须大于0')
        }else{
            callback()
        }
    }
    //获取分类列表
    getCategory= async ()=>{
        const result = await reqCategoryList()
        if(result.status===0){
            this.setState({
                categorys:result.data
            })
        }
    }
    //提交表单
    handleSubmit=(event)=>{
        event.preventDefault()
        // alert('success')
        //提交表单的时候发送请求
        //提交表单的时候验证，校验全部组件
        this.props.form.validateFields(async (error,values)=>{
            if(!error){
            const {categoryId,name,desc,price}=values
                // console.log(categoryId,name,desc,price,detail,imgs)

                // 得到所有上传图片文件名的数组
            const imgs= this.findComponent.current.getImgs()
            //    console.log(imgs)
            //得到富文本里的数据
            const detail = this.getText.current.getDetail()
            const product={categoryId,name,desc,price,imgs,detail}
            //判断是在更新还是在修改，要是进行修改操作，就把this.product的ID存进去
            if(this.product._id){
                product._id=this.product._id
            }
            
            const result = await reqAddUpdateProduct(product)
            if(result.status===0){
                message.success(`数据${product._id?'修改':'添加'}成功`)    //？？？永远是false？？
                
                this.props.history.replace('/product')
            }
            
            }else{
                message.error('提交表单失败')
            }
        })
    }

    componentDidMount() {
        //异步获取列表名称
        this.getCategory()
    }
    
    //在willmount里获取修改的product对象
    componentWillMount() {
        const product = this.props.location.state
        console.log(product)
        
        //如果product中没有数据，就说明是添加，如果有数据，就说明是修改
            //把product保存起来
            this.product=product || {}
            //动态显示添加/修改
            if(product){
                this.update='修改'
            }else{
                this.update='添加'
            }

    }
    


    render() {
        const title=(
          <span>
              <LinkButton onClick={() => this.props.history.goBack()}>
                <Icon type="arrow-left"></Icon>
            </LinkButton>
              <span style={{margin:'0 10px 0 '}}>{this.update}商品</span>
          </span>  
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 },
          }
        const {getFieldDecorator} =this.props.form
        const {categorys} =this.state
        const product=this.product
        return (
            <Card title={title} >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue:product.name,
                            rules: [
                                {required: true, message: '请输入商品名称！',},
                            ],
                        })(<Input placeholder="请输入商品名称" />)}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue:product.desc,
                            rules: [
                                {required: true, message: '请输入商品描述！'}
                            ],
                        })(<Input placeholder="请输入商品描述" />)}
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue:product.price,
                            rules: [
                                {required: true, message: '请输入商品价格！',},
                                {validator:this.LimitNumber}
                            ],
                        })(<Input placeholder="请输入商品价格" addonAfter='元' type='number' />)}
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoryId', {
                            initialValue:product.categoryId,
                            rules: [
                                {required: true, message: '请输入商品价格！',},
                                {validator:this.LimitNumber}
                            ],
                        })(<Select>
                            <Option value=''>请选择</Option>
                            {
                                //获取商品分类信息，然后遍历下拉选项框，根据ID获取分类。
                                categorys.map((item)=>(<Option key={item._id} value={item._id}>{item.name}</Option>))

                            }
                        </Select>)}
                    </Item>
                    <Item label="商品图片" wrapperCol={{ span: 15}}>
                        {/* 给修改页面传入数组图片 */}
                        <PicturesWall ref={this.findComponent} imgs={product.imgs} />
                    </Item>
                    <Item label="商品详情"  wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.getText} detail={product.detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' htmlType='submit' >提交</Button>
                    </Item>
                </Form>


            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdata)