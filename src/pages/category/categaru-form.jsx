import React, { Component } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

 class CategaruForm extends Component {
    //限制传入过来的属性值,接收过来的属性在这里限制。
    static propTypes={
        categoryName:PropTypes.string,
        //限制传入的获取form的属性值为函数
        setForm:PropTypes.func
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        
        const { getFieldDecorator } = this.props.form;
        const { categoryName }=this.props
        console.log(categoryName)

        return (
            <Form>
                <Item>
                {getFieldDecorator('categoryName', {
                                initialValue:categoryName || '', // 初始值
                                rules: [
                                    { required: true,whitespace:true, message: '请输入内容!' }
                                ],
                            })(
                                <Input type='text' 
                                    placeholder="请输入用户名"
                                />,
                            )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(CategaruForm)
