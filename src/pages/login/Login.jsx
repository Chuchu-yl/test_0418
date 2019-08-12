import React from 'react'
import logo from './imgs/logo.png'
import { Form, Icon, Input, Button } from 'antd';
import './login.less'


 class Login extends React.Component{
        handleSubmit=(event)=>{
            event.preventDefault()
            // alert('123')
            console.log(this.props.form)
            const {getFieldsValue,getFieldValue}=this.props.form
            const values=getFieldsValue()  //接收的为一个对象，包含你所输入的内容
            const username=getFieldValue('username') //必须得传入字符串来接收对应的值
            const password=getFieldValue('password')
            console.log(values,username,password)
        }

        render(){
            const { getFieldDecorator } = this.props.form;
            return(
                <div className='login'>
                    <div className='login-header'>
                        <h1><img src={logo} alt="login"/></h1>
                        <p>后台管理系统</p>
                    </div>
                    <div className='login-content'>
                        <h1>用户登录</h1>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入内容!' }],
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )
        }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm