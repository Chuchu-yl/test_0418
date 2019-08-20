import React, { Component } from 'react'
import { Form,Input ,Select} from 'antd'
import PropTypes from 'prop-types'

import {reqRoleList} from '../../api'

const Item=Form.Item
const Option=Select.Option

class UserForm extends Component {

    state={
        roleArr:[]
    }
    static propsType={
        setForm:PropTypes.func.isRequired,
        user:PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    
/*
动态获取角色，根据角色ID获取角色
*/
getRole=async ()=>{

    const result = await reqRoleList()
    // console.log(result)
    if(result.status===0){
        const roleArr=result.data
        this.setState({
            roleArr
        })
        // console.log(roleArr)
        // console.log(this.props.user)
    }
}
componentDidMount() {
    this.getRole()
}


    render() {
        const {getFieldDecorator}=this.props.form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 13 },
        }
        const {roleArr}=this.state
        const {user}=this.props 
        
        return (
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                        {required: true, message: '请输入用户名称！', }
                        ],
                    })(<Input placeholder='请输入用户名' />)}
                </Item>
                {
                    !user._id?
                    (
                        <Item label='密码'>
                            {getFieldDecorator('password', {
                                initialValue: user.password,
                                rules: [
                                {required: true, message: '请输入密码！',}
                                ],
                            })(<Input placeholder='请输入密码' />)}
                        </Item>
                    ):null
                }
                <Item label='手机号'>
                    {getFieldDecorator('phone', {
                        initialValue:user.phone,
                        rules: [
                        {required: true, message: '请输入手机号！', }
                        ],
                    })(<Input placeholder='请输入手机号' />)}
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                        rules: [
                        {required: false, message: '请输入邮箱！', }
                        ],
                    })(<Input placeholder='请输入邮箱' />)}
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        rules: [
                        {required: true, message: '请输入角色！', }
                        ],
                    })(
                    <Select >
                       {
                           roleArr.map((item)=>{
                               return (<Option key={item._id}>{item.name}</Option>)
                           })
                       }
                    </Select>
                    )}
                </Item>
            </Form>
        )
    }
}
export default UserForm=Form.create()(UserForm)
