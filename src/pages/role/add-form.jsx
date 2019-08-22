import React, { Component } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

const Item =Form.Item
class AddForm extends Component {

static propTypes={
    setForm: PropTypes.func.isRequired
}

componentWillMount() {
    this.props.setForm(this.props.form)  //把form属性传递过去 
}




    render() {
            const formItemLayout = {
                labelCol: { span: 4 },
                wrapperCol: { span: 10 },
            }
            const {getFieldDecorator} =this.props.form
        return (
        <Form {...formItemLayout}>
            {/* <Item >
                <Input></Input>
            </Item> */}
            <Item label="角色名称" >
                {getFieldDecorator('roleName ', {
                    initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名称！',
                    },
                    
                  ],
                })(<Input placeholder=' 请输入角色名称' />)}
            </Item>
        </Form>
        )
    }
}
export default AddForm = Form.create()(AddForm)
