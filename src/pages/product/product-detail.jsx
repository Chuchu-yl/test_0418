import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'

import {LinkButton} from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import {IMG_BASE_URL} from '../../utils/constant'
import {reqProductById,reqCategoryById} from '../../api'

const Item=List.Item
export default class ProductDetail extends Component {

    state={
        product:{},
        categoryName:'' //根据分类ID获取分类名称
    }

    getCategoryName=async(categoryId)=>{
        const result=await reqCategoryById(categoryId)
        console.log(result)
        if(result.status===0){
            const categoryName=result.data.name
            this.setState({
                categoryName
            })
        }
    }


    //从内存中获取product对象
    componentWillMount() {
        const product=memoryUtils.product
        if(product._id){
             this.setState({
                product
            })
        }
       
    }   
//根据ID获取product对象
  async componentDidMount() {
    //如果内存中没有数据，就发送请求获取product
    if(!this.state.product._id){
        const productId=this.props.match.params.id
        const result=  await reqProductById(productId)
        
      if(result.status===0){
          const product=result.data
          this.getCategoryName(product.categoryId)
          this.setState({
              product
          })
      }
    }else{
        const categoryId=this.state.product.categoryId
        this.getCategoryName(categoryId)
    }
}



    render() {
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        const {product,categoryName}=this.state
        return (
            <Card title={title}>
                <List>
                    <Item>
                        <span className='product-detail'>商品名称 : </span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className='product-detail'>商品描述 : </span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='product-detail'>商品价格 : </span>
                        <span>{product.price} 元</span>
                    </Item>
                    <Item>
                        <span className='product-detail'>所属分类 : </span>
                        <span>{categoryName}</span>
                    </Item>
                    <Item>
                        <span className='product-detail'>商品图片 : </span>
                        {
                            product.imgs && product.imgs.map((item)=>(
                                <img className='product-detail-imgs' src={IMG_BASE_URL+item} key={item}/>
                            ))
                        }
                        
                    </Item>
                    <Item>
                        <span className='product-detail'>商品详情 : </span>
                        <span dangerouslySetInnerHTML={{ __html: product.detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
