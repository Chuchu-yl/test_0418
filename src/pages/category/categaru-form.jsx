import React, { Component } from 'react'
import {Form,Input} from 'antd'
const Item = Form.Item

 class CategaruForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item>
                {getFieldDecorator('username', {
                                initialValue: '', // 初始值
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
