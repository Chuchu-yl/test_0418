import React from 'react'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button,message } from 'antd';
//请求某个接口，就得引入某个接口请求函数
import {reqLogin} from '../../api'
import {Redirect} from 'react-router-dom'
import {savaUser} from '../../utils/storageUtils'

import './login.less'
import memoryUtils from '../../utils/memoryUtils';

// import {Redirect} from 'react-router-dom'
 class Login extends React.Component{
        handleSubmit=(event)=>{
            event.preventDefault()
            // alert('123')
            // console.log(this.props.form)
            // const {getFieldsValue,getFieldValue}=this.props.form
            // const values=getFieldsValue()  //接收的为一个对象，包含你所输入的内容
            // const username=getFieldValue('username') //必须得传入字符串来接收对应的值
            // const password=getFieldValue('password')
            // console.log(values,username,password)
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                //   alert('验证通过')
                const result=await reqLogin(values)
                //判断，result.status为0，就说明登录请求成功
                if(result.status===0){
                    //返回的promise对象中的data数据需要存入到用户的浏览器中去
                    //得到user（user就是data数据对象）
                    const user =result.data
                    //保存user（保存在local中，也要保存在内存中）
                    //保存到local
                    // localStorage.setItem('user_key',JSON.stringify(user)) //转换为json数据类型
                    savaUser(user)
                    //保存到内存
                    memoryUtils.user=user  //对象中有了user数据
                    //跳转到admin界面（编程式）
                    this.props.history.replace('/')
                }else{
                    message.error(result.msg)
                }
                }
              })
        }
        handleConfirmPassword=(rule, value, callback)=>{
           // const {getFieldValue}=this.props.form
           value = value.trim()
           if (!value) {
             callback('密码必须输入')
           } else if (value.length<4) {
             callback('密码不能小于4位')
           } else if (value.length > 12) {
             callback('密码不能大于12位')
           } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
             callback('密码必须是英文、数字或下划线组成')
           } else {
             callback() // 通过校验
           }
        }
       

        render(){
            const { getFieldDecorator } = this.props.form;
            //如果已经登录，在地址中请求login，是不行的，转换到admin
            const user = memoryUtils.user
            if(user._id){
                return <Redirect to='/'/>
            }
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
                                initialValue: 'admin', // 初始值
                                rules: [
                                    { required: true,whitespace:true, message: '请输入内容!' },
                                    {min:4,message:'用户名必须大于4位！'},
                                    {max:12,message:'用户名必须小于12位！'},
                                    {pattern:/^[a-zA-Z0-9_]+$/,message:'请输入正确的字符！'}
                                ],
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                initialValue: '',
                                rules: [//自定义验证
                                    {validator:this.handleConfirmPassword }
                                ],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            <Button  type="primary" htmlType="submit" className="login-form-button">
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